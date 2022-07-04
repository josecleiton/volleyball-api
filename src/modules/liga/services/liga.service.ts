import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getHours, getMinutes } from 'date-fns';
import { validTimeStringToDate } from 'src/modules/core/validations';
import { EquipePartida } from 'src/modules/partida/entities/equipe-partida.entity';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { PartidaRepository } from 'src/modules/partida/repositories/partida.repository';
import { tiposDeRodadaClassificatoria } from 'src/modules/partida/types/tipo-rodada.type';
import { Connection } from 'typeorm';
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
import { LigaIdStatus } from '../types/liga-id-status.type';

@Injectable()
export class LigaService {
  constructor(
    private readonly ligaRepository: LigaRepository,
    private readonly partidaRepository: PartidaRepository,
    private readonly equipeService: EquipeService,
    private readonly classificacaoService: ClassificacaoGeneratorService,
    private readonly quartasService: QuartaDeFinalGeneratorService,
    private readonly semisService: SemifinalGeneratorService,
    private readonly finalService: FinalGeneratorService,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly connection: Connection,
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

    const [ligaAtualizada, partidasSalvas] = await this.connection.transaction(
      async (manager) => {
        await manager.insert(
          EquipePartida,
          partidas.map((x) => [x.mandante, x.visitante]).flat(),
        );
        const partidasSalvas = await manager.save(partidas);
        await manager.save(
          partidas
            .map((x) => {
              x.mandante.idPartida = x.visitante.idPartida = x.id;
              return [x.mandante, x.visitante];
            })
            .flat(),
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
      await this.connection.transaction(async (manager) => {
        await this.partidaRepository.removePartidasNaoDisputadas(id, manager);

        return [await manager.save(liga), await manager.save(partidas)];
      });

    return new QuartasLigaRespostaDto(ligaAtualizada, partidasAgendadas);
  }

  async inicializaSemis(id: string, requisicao: InicializaSemifinalDto) {
    const liga = await this.devePegarEntidade(id);
    if (liga.status !== StatusLiga.SEMIS) {
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
      await this.connection.transaction(async (manager) => {
        await this.partidaRepository.removePartidasNaoDisputadas(id, manager);

        return [await manager.save(liga), await manager.save(partidas)];
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
      await this.connection.transaction(async (manager) => {
        await this.partidaRepository.removePartidasNaoDisputadas(id, manager);

        return [await manager.save(liga), await manager.save(partidas)];
      });

    return new FinalLigaRespostaDto(ligaAtualizada, partidasAgendadas);
  }

  private async getLigaIniciadaEm(id: string) {
    return this.ligaRepository.findOne({
      where: { id },
      select: ['id', 'dataComeco'],
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
    const resultado: LigaIdStatus | undefined =
      await this.ligaRepository.findOne({
        where: { id },
        select: ['id', 'status'],
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

  private async devePegarEntidade(id: string, relations?: string[]) {
    const liga = await this.ligaRepository.findOne(id, { relations });
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
