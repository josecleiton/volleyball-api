import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { getHours, getMinutes } from 'date-fns';
import { TypeORMFilterService, validTimeStringToDate } from 'src/modules/core';
import { EquipeService } from 'src/modules/equipe';
import {
  PartidaRepository,
  SalvaPartidaFacade,
  tiposDeRodadaClassificatoria,
  StatusPartida,
} from 'src/modules/partida';
import { DataSource, FindOptionsRelations } from 'typeorm';
import {
  CriaLigaDto,
  LigaRespostaDto,
  InicializaLigaDto,
  InicializaLigaRespostaDto,
  InicializaQuartaDeFinalDto,
  QuartasLigaRespostaDto,
  InicializaSemifinalDto,
  SemisLigaRespostaDto,
  InicializaFinalDto,
  FinalLigaRespostaDto,
} from '../dto';
import { Liga } from '../entities';
import { StatusLiga } from '../enums';
import { LigaRepository } from '../repositories';
import {
  ClassificacaoGeneratorService,
  QuartaDeFinalGeneratorService,
  SemifinalGeneratorService,
  FinalGeneratorService,
  MataMataGeneratorService,
} from '../tabela';
import { LigaIdStatus } from '../types';

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
        entityName: 'Competição',
      });
    }
  }

  async iniciaLiga(id: string, requisicao: InicializaLigaDto) {
    const liga = await this.ligaRepository.encontraUmComEquipesCompletas(id);

    if (!liga) {
      throw new NotFoundException(`Liga ${id} não encontrada`);
    }

    if (liga.dataComeco) {
      throw new ConflictException(
        `Liga ${liga.id} já iniciada. Data de início: ${liga.dataComeco}`,
      );
    }

    if (liga.equipes?.length !== Liga.quantidadeDeEquipesNaLiga) {
      throw new ConflictException(
        `Quantidade de equipes na liga ${id} não é ${Liga.quantidadeDeEquipesNaLiga}`,
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
        `Liga ${liga.id} não é ${StatusLiga.CLASSIFICATORIA} e sim ${liga.status}`,
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
        `Quantidades de partidas concluídas na liga ${liga.id} não é igual a ${Liga.quantidadeDePartidasNaClassificacao}`,
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
        `O status da Liga ${liga.id} não é ${StatusLiga.QUARTAS}`,
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
        `O status da Liga ${liga.id} não é ${StatusLiga.QUARTAS}`,
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
        `O status da Liga ${liga.id} não é ${StatusLiga.QUARTAS}`,
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
        `O confronto final da liga ${id} não foi disputado`,
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

    throw new ConflictException(`Liga ${id} já está iniciada.`);
  }

  async deveEncontrarLigaIniciada(id: string) {
    const resultado = await this.getLigaIniciadaEm(id);
    if (resultado?.dataComeco) {
      return { id, dataComeco: resultado.dataComeco };
    }

    throw new ConflictException(`Liga ${id} não está iniciada.`);
  }

  async excecaoSeALigaStatus(id: string, status: StatusLiga) {
    const resultado: LigaIdStatus | null = await this.ligaRepository.findOne({
      where: { id },
      select: { id: true, status: true },
    });

    if (resultado?.status === status) {
      throw new NotFoundException(
        `Liga ${id} não encontrada com status ${status}`,
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
      throw new NotFoundException(`Liga ${id} não encontrada`);
    }

    return liga;
  }

  async deveEncontrarUm(id: string) {
    return new LigaRespostaDto(await this.devePegarEntidade(id));
  }

  async remove(id: string) {
    const resultado = await this.ligaRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Liga ${id} não encontrada`);
    }
  }
}
