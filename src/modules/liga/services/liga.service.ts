import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { PartidaRepository } from 'src/modules/partida/repositories/partida.repository';
import { Connection } from 'typeorm';
import { TypeORMFilterService } from '../../core/services/typeorm-filter.service';
import { EquipeService } from '../../equipe/equipe.service';
import {
  CriaLigaDto,
  InicializaLigaDto,
  InicializaLigaRespostaDto,
  LigaRespostaDto,
  QuartasLigaRespostaDto,
  SemisLigaRespostaDto,
} from '../dto/liga.dto';
import {
  InicializaQuartaDeFinalDto,
  InicializaSemifinalDto,
} from '../dto/tabela.dto';
import { Liga } from '../entities/liga.entity';
import { StatusLiga } from '../enums/estado-liga.enum';
import { LigaRepository } from '../repositories/liga.repository';
import { PontuacaoEquipeRepository } from '../repositories/pontuacao_equipe.repository';
import { ClassificacaoGeneratorService } from '../tabela/classificacao-generator.service';
import { QuartaDeFinalGeneratorService } from '../tabela/quarta-de-final-generator.service';
import { SemifinalGeneratorService } from '../tabela/semifinal-generator.service';

@Injectable({ scope: Scope.REQUEST })
export class LigaService {
  constructor(
    private readonly ligaRepository: LigaRepository,
    private readonly pontuacaoEquipeRepository: PontuacaoEquipeRepository,
    private readonly partidaRepository: PartidaRepository,
    private readonly equipeService: EquipeService,
    private readonly classificacaoService: ClassificacaoGeneratorService,
    private readonly quartasService: QuartaDeFinalGeneratorService,
    private readonly semisService: SemifinalGeneratorService,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly connection: Connection,
  ) {}

  async criaLiga(requisicao: CriaLigaDto) {
    const liga = this.ligaRepository.create(requisicao);

    try {
      return new LigaRespostaDto(await this.ligaRepository.save(liga));
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Competição',
      });
    }
  }

  async iniciaLiga(id: string, requisicao: InicializaLigaDto) {
    const liga = await this.ligaRepository.encontraUmComEquipesCompletas(id);

    if (liga.dataComeco) {
      throw new ConflictException(
        `Liga ${liga.id} já iniciada. Data de início: ${liga.dataComeco}`,
      );
    }

    if (liga.equipes?.length !== Liga.minimoDeEquipesNaLiga) {
      throw new ConflictException(
        `Quantidade de equipes na liga ${id} não é ${Liga.minimoDeEquipesNaLiga}`,
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
      horarios: requisicao.horarios,
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
        const partidasSalvas = await manager.save(partidas);
        const ligaSalva = await manager.save(liga);
        await manager.save(
          liga.equipes.map(({ id }) =>
            this.pontuacaoEquipeRepository.create({ id }),
          ),
        );

        return [ligaSalva, partidasSalvas];
      },
    );

    return new InicializaLigaRespostaDto(ligaAtualizada, partidasSalvas);
  }

  async inicializaQuartas(id: string, requisicao: InicializaQuartaDeFinalDto) {
    const liga = await this.devePegarEntidade(id);
    if (liga.status !== StatusLiga.CLASSIFICATORIA) {
      throw new ConflictException(
        `Liga ${liga.id} não está no estado ${StatusLiga.CLASSIFICATORIA} e sim ${liga.status}`,
      );
    }

    const partidas = await this.quartasService.geraPartidas({
      ...requisicao,
      idLiga: id,
    });

    liga.status = StatusLiga.QUARTAS;

    const [ligaAtualizada, partidasAgendadas] =
      await this.connection.transaction(async (manager) => [
        await manager.save(liga),
        await manager.save(partidas),
      ]);

    return new QuartasLigaRespostaDto(ligaAtualizada, partidasAgendadas);
  }

  async inicializaSemis(id: string, requisicao: InicializaSemifinalDto) {
    const liga = await this.devePegarEntidade(id);
    if (liga.status !== StatusLiga.SEMIS) {
      throw new ConflictException(
        `Liga ${liga.id} não está ${StatusLiga.QUARTAS}`,
      );
    }

    const partidas = await this.semisService.geraPartidas({
      ...requisicao,
      idLiga: id,
    });

    const [ligaAtualizada, partidasAgendadas] =
      await this.connection.transaction(async (manager) => {
        await this.partidaRepository.removePartidasSemGanhadores(
          id,
          'semis',
          manager,
        );

        return [await manager.save(liga), await manager.save(partidas)];
      });

    return new SemisLigaRespostaDto(ligaAtualizada, partidasAgendadas);
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

  async excecaoSeALigaNaoEstaIniciada(id: string) {
    const resultado = await this.getLigaIniciadaEm(id);
    if (resultado?.dataComeco) {
      return;
    }

    throw new ConflictException(`Liga ${id} não está iniciada.`);
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
