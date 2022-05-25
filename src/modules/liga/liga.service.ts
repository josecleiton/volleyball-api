import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeORMFilterService } from '../core/services/typeorm-filter.service';
import { EquipeService } from '../equipe/equipe.service';
import { Partida } from '../partida/entities/partida.entity';
import {
  CriaLigaDto,
  InicializaLigaRespostaDto,
  LigaRespostaDto,
} from './dto/liga.dto';
import { Liga } from './entities/liga.entity';
import { LigaRepository } from './liga.repository';
import { ClassificacaoGenerator } from './tabela/classificacao.service';

@Injectable({ scope: Scope.REQUEST })
export class LigaService {
  constructor(
    private readonly ligaRepository: LigaRepository,
    private readonly equipeService: EquipeService,
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

  async iniciaLiga(id: string) {
    const liga = await this.ligaRepository.pegaUmComEquipesCompletas(id);

    if (liga.dataComeco) {
      throw new ConflictException(
        `Liga ${liga.id} já iniciada na data: ${liga.dataComeco}`,
      );
    }

    if (
      liga.equipes.length >= Liga.minimoDeEquipesNaLiga &&
      liga.equipes.length % 2 === 0
    ) {
      throw new ConflictException(
        `Quantidade de equipes na liga ${id} não é suficiente ou não é par. Quantidade: ${liga.equipes.length}`,
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

    liga.dataComeco = new Date();

    const classificacaoGenerator = new ClassificacaoGenerator(
      liga.equipes.length,
      liga.dataComeco,
    );
    const partidas = liga.equipes.reduce((result, equipe, equipeIdx) => {
      const confrontos = liga.equipes.reduce(
        (result, equipeAdversaria, equipeAdversariaIdx) => {
          if (equipe.id === equipeAdversaria.id) {
            return result;
          }

          const partidasGeradas = classificacaoGenerator.geraIdaEVolta(
            {
              equipe,
              posicao: equipeIdx,
            },
            {
              equipe: equipeAdversaria,
              posicao: equipeAdversariaIdx,
            },
          );

          return result.concat(partidasGeradas);
        },
        [] as Partida[],
      );

      return result.concat(confrontos);
    }, [] as Partida[]);

    const [ligaAtualizada, partidasInseridas] =
      await this.connection.transaction(async (manager) => {
        const partidasSave = await manager.save(partidas);
        const ligaSave = await manager.save(liga);

        return [ligaSave, partidasSave];
      });

    return new InicializaLigaRespostaDto(ligaAtualizada, partidasInseridas);
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
