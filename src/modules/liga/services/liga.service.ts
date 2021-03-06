import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getHours, getMinutes } from 'date-fns';
import { validTimeStringToDate } from 'src/modules/core/validations';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { SalvaPartidaFacade } from 'src/modules/partida/facades/salva-partida.facade';
import { PartidaRepository } from 'src/modules/partida/repositories/partida.repository';
import { tiposDeRodadaClassificatoria } from 'src/modules/partida/types/tipo-rodada.type';
import { DataSource, FindOptionsRelations } from 'typeorm';
import { TypeORMFilterService } from '../../core/services/typeorm-filter.service';
import { EquipeService } from '../../equipe/equipe.service';
import {
  CriaLigaDto,
  FinalLigaRespostaDto,
  InicializaLigaDto,
  InicializaLigaRespostaDto,
  LigaRespostaDto,
  QuartasLigaRespostaDto,
  SemisLigaRespostaDto,
} from '../dto/liga.dto';
import {
  InicializaFinalDto,
  InicializaQuartaDeFinalDto,
  InicializaSemifinalDto,
} from '../dto/tabela.dto';
import { Liga } from '../entities/liga.entity';
import { StatusLiga } from '../enums/status-liga.enum';
import { LigaRepository } from '../repositories/liga.repository';
import {
  ClassificacaoGeneratorService,
  FinalGeneratorService,
  QuartaDeFinalGeneratorService,
  SemifinalGeneratorService,
} from '../tabela';
import { MataMataGeneratorService } from '../tabela/mata-mata-generator.service';
import { LigaIdStatus } from '../types/liga-id-status.type';

@Injectable()
export class LigaService {
  constructor(
    private readonly ligaRepository: LigaRepository,
    private readonly partidaRepository: PartidaRepository,
    private readonly equipeService: EquipeService,
    private readonly classificacaoService: ClassificacaoGeneratorService,
    private readonly salvaPartidas: SalvaPartidaFacade,
    private readonly quartasService: QuartaDeFinalGeneratorService,
    private readonly semisService: SemifinalGeneratorService,
    private readonly finalService: FinalGeneratorService,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly dataSource: DataSource,
  ) {}

  async criaLiga(requisicao: CriaLigaDto) {
    const liga = this.ligaRepository.create(requisicao);

    try {
      return new LigaRespostaDto(await this.ligaRepository.save(liga));
    } catch (error) {
      throw this.typeormFilterService.catch({
        error,
        description: 'Conflito',
        entityName: 'Competi????o',
      });
    }
  }

  async iniciaLiga(id: string, requisicao: InicializaLigaDto) {
    const liga = await this.ligaRepository.encontraUmComEquipesCompletas(id);

    if (!liga) {
      throw new NotFoundException(`Liga ${id} n??o encontrada`);
    }

    if (liga.dataComeco) {
      throw new ConflictException(
        `Liga ${liga.id} j?? iniciada. Data de in??cio: ${liga.dataComeco}`,
      );
    }

    if (liga.equipes?.length !== Liga.quantidadeDeEquipesNaLiga) {
      throw new ConflictException(
        `Quantidade de equipes na liga ${id} n??o ?? ${Liga.quantidadeDeEquipesNaLiga}`,
      );
    }

    if (!liga.arbitros?.length) {
      throw new ConflictException(`Tem que ter ao menos um arbitro na liga`);
    }

    if (!liga.delegados?.length) {
      throw new ConflictException(`Tem que ter ao menos um delegado na liga`);
    }

    if (!liga.equipes.every((equipe) => equipe.apta)) {
      await this.equipeService.atualizaAptidao(liga.equipes);
      throw new ConflictException('Todas as equipes precisam estar aptas');
    }

    liga.dataComeco = requisicao.data ?? new Date();
    liga.configuracaoInicializacaoLiga = {
      diasDaSemana: requisicao.diasDaSemana,
      horarios: requisicao.horarios.map((horarioStr) => {
        const date = validTimeStringToDate(horarioStr);
        return getHours(date) * 60 + getMinutes(date);
      }),
      intervaloDeDiasUteisEntreTurnos:
        requisicao.intervaloDeDiasUteisEntreTurnos,
    };

    const partidas = this.classificacaoService.geraPartidas({
      equipes: liga.equipes,
      dataComeco: liga.dataComeco,
      ...liga.configuracaoInicializacaoLiga,
    });

    liga.status = StatusLiga.CLASSIFICATORIA;

    const [ligaAtualizada, partidasSalvas] = await this.dataSource.transaction(
      async (manager) => {
        const partidasSalvas = await this.salvaPartidas.executa(
          partidas,
          manager,
        );
        const ligaSalva = await manager.save(liga);

        return [ligaSalva, partidasSalvas];
      },
    );

    return new InicializaLigaRespostaDto(ligaAtualizada, partidasSalvas);
  }

  async inicializaQuartas(id: string, requisicao: InicializaQuartaDeFinalDto) {
    const liga = await this.devePegarEntidade(id);
    if (liga.status !== StatusLiga.CLASSIFICATORIA) {
      throw new ConflictException(
        `Liga ${liga.id} n??o ?? ${StatusLiga.CLASSIFICATORIA} e sim ${liga.status}`,
      );
    }

    const quantidadeDePartidasPorTipoRodada =
      await this.partidaRepository.quantidadeDePartidasPorTipoRodadaEStatus({
        idLiga: liga.id,
        tiposDeRodada: [...tiposDeRodadaClassificatoria],
        statusAceitos: [StatusPartida.CONCLUIDA, StatusPartida.WO],
      });

    if (
      quantidadeDePartidasPorTipoRodada !==
      Liga.quantidadeDePartidasNaClassificacao
    ) {
      throw new ConflictException(
        `Quantidades de partidas conclu??das na liga ${liga.id} n??o ?? igual a ${Liga.quantidadeDePartidasNaClassificacao}`,
      );
    }

    const partidas = await this.quartasService.geraPartidas({
      ...requisicao,
      idLiga: id,
    });

    liga.status = StatusLiga.QUARTAS;

    const [ligaAtualizada, partidasAgendadas] =
      await this.dataSource.transaction(async (manager) => [
        await manager.save(liga),
        await this.salvaPartidas.executa(partidas, manager),
      ]);

    return new QuartasLigaRespostaDto(ligaAtualizada, partidasAgendadas);
  }

  async inicializaSemis(id: string, requisicao: InicializaSemifinalDto) {
    const liga = await this.devePegarEntidade(id);
    if (liga.status !== StatusLiga.QUARTAS) {
      throw new ConflictException(
        `O status da Liga ${liga.id} n??o ?? ${StatusLiga.QUARTAS}`,
      );
    }

    const partidas = await this.semisService.geraPartidas({
      ...requisicao,
      idLiga: id,
    });

    liga.status = StatusLiga.SEMIS;
    const [ligaAtualizada, partidasAgendadas] =
      await this.dataSource.transaction(async (manager) => {
        await this.partidaRepository.removePartidasNaoDisputadas(id, manager);

        return [
          await manager.save(liga),
          await this.salvaPartidas.executa(partidas, manager),
        ];
      });

    return new SemisLigaRespostaDto(ligaAtualizada, partidasAgendadas);
  }

  async inicializaFinal(id: string, requisicao: InicializaFinalDto) {
    const liga = await this.devePegarEntidade(id);
    if (liga.status !== StatusLiga.SEMIS) {
      throw new ConflictException(
        `O status da Liga ${liga.id} n??o ?? ${StatusLiga.QUARTAS}`,
      );
    }

    const partidas = await this.finalService.geraPartidas({
      datas: [...requisicao.datas],
      mandos: [requisicao.mando],
      idLiga: id,
    });

    liga.status = StatusLiga.FINAL;

    const [ligaAtualizada, partidasAgendadas] =
      await this.dataSource.transaction(async (manager) => {
        await this.partidaRepository.removePartidasNaoDisputadas(id, manager);

        return [
          await manager.save(liga),
          await this.salvaPartidas.executa(partidas, manager),
        ];
      });

    return new FinalLigaRespostaDto(ligaAtualizada, partidasAgendadas);
  }

  async premiacao(id: string) {
    const liga = await this.devePegarEntidade(id);
    if (liga.status !== StatusLiga.FINAL) {
      throw new ConflictException(
        `O status da Liga ${liga.id} n??o ?? ${StatusLiga.QUARTAS}`,
      );
    }

    const partidas = await this.partidaRepository.listaPartidasOrdenadas({
      idLiga: liga.id,
      tipoRodada: 'final',
    });

    const partidasComGanhador = partidas.filter((x) => Boolean(x.ganhadora));

    if (
      partidasComGanhador.length !==
      MataMataGeneratorService.quantidadesDePartidasParaVencerConfronto
    ) {
      throw new ConflictException(
        `O confronto final da liga ${id} n??o foi disputado`,
      );
    }

    liga.status = StatusLiga.PREMIACAO;

    return this.dataSource
      .transaction(async (manager) => {
        await this.partidaRepository.removePartidasNaoDisputadas(id, manager);

        return this.ligaRepository.save(liga);
      })
      .then((x) => new LigaRespostaDto(x));
  }

  private async getLigaIniciadaEm(id: string) {
    return this.ligaRepository.findOne({
      where: { id },
      select: { id: true, dataComeco: true },
    });
  }

  async excecaoSeALigaEstaIniciada(id: string) {
    const resultado = await this.getLigaIniciadaEm(id);
    if (!resultado?.dataComeco) {
      return;
    }

    throw new ConflictException(`Liga ${id} j?? est?? iniciada.`);
  }

  async deveEncontrarLigaIniciada(id: string) {
    const resultado = await this.getLigaIniciadaEm(id);
    if (resultado?.dataComeco) {
      return { id, dataComeco: resultado.dataComeco };
    }

    throw new ConflictException(`Liga ${id} n??o est?? iniciada.`);
  }

  async excecaoSeALigaStatus(id: string, status: StatusLiga) {
    const resultado: LigaIdStatus | null = await this.ligaRepository.findOne({
      where: { id },
      select: { id: true, status: true },
    });

    if (resultado?.status === status) {
      throw new NotFoundException(
        `Liga ${id} n??o encontrada com status ${status}`,
      );
    }
  }

  async lista() {
    const list = await this.ligaRepository.find({
      order: { dataCriacao: 'DESC' },
    });
    return list.map((x) => new LigaRespostaDto(x));
  }

  private async devePegarEntidade(
    id: string,
    relations?: FindOptionsRelations<Liga>,
  ) {
    const liga = await this.ligaRepository.findOne({
      where: { id },
      relations,
    });
    if (!liga) {
      throw new NotFoundException(`Liga ${id} n??o encontrada`);
    }

    return liga;
  }

  async deveEncontrarUm(id: string) {
    return new LigaRespostaDto(await this.devePegarEntidade(id));
  }

  async remove(id: string) {
    const resultado = await this.ligaRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Liga ${id} n??o encontrada`);
    }
  }
}
