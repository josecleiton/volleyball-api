import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { LigaService } from '../competicao/liga.service';
import { TypeORMFilterService } from '../core/services/typeorm-filter.service';
import { GinasioService } from '../ginasio/ginasio.service';
import {
  AtualizaEquipeDto,
  CriaEquipeDto,
  EquipeRespostaDto,
  ListaEquipesDto,
} from './dto/equipe.dto';
import { Equipe } from './entities/equipe.entity';
import { EquipeRepository } from './equipe.repository';

@Injectable({ scope: Scope.REQUEST })
export class EquipeService {
  constructor(
    private readonly equipeRepository: EquipeRepository,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
    private readonly ginasioService: GinasioService,
    private readonly ormFilterService: TypeORMFilterService,
  ) {}

  async criaEquipe(request: CriaEquipeDto) {
    await this.ligaService.excecaoSeALigaEstaIniciada(request.idLiga);
    await this.ginasioService.devePegarUm(request.idGinasio);

    try {
      return new EquipeRespostaDto(
        await this.equipeRepository.save(
          this.equipeRepository.create({ ...request }),
        ),
      );
    } catch (e) {
      this.ormFilterService.catch({
        error: e,
        entityName: 'Equipe',
        description: 'nome já utilizado',
      });
    }
  }

  async atualizaAptidao(equipes: Equipe[]) {
    await this.equipeRepository.save(equipes);
  }

  async listaEquipes(request: ListaEquipesDto) {
    const equipes = await this.equipeRepository.find({ where: { ...request } });
    return equipes.map((x) => new EquipeRespostaDto(x));
  }

  async deveEncontrarEntidade(id: string) {
    const equipe = await this.equipeRepository.findOne(id);
    if (!equipe) {
      throw new NotFoundException(`Equipe ${id} não encontrada`);
    }

    return equipe;
  }

  async deveEncontrarUm(id: string) {
    return new EquipeRespostaDto(await this.deveEncontrarEntidade(id));
  }

  async atualizaEquipe(id: string, requisicao: AtualizaEquipeDto) {
    const equipe = await this.deveEncontrarEntidade(id);
    await this.ligaService.excecaoSeALigaEstaIniciada(equipe.idLiga);

    if (requisicao.nome) {
      equipe.nome = requisicao.nome;
    }
    if (requisicao.urlBrasao) {
      equipe.urlBrasao = requisicao.urlBrasao;
    }
    if (requisicao.idGinasio && requisicao.idGinasio !== equipe.idGinasio) {
      await this.ginasioService.devePegarUm(requisicao.idGinasio);
    }

    return new EquipeRespostaDto(await this.equipeRepository.save(equipe));
  }

  async remove(id: string) {
    const resultado: { id: string; idLiga: string } | undefined =
      await this.equipeRepository.findOne({
        where: { id },
        select: ['id', 'idLiga'],
      });
    if (!resultado) {
      throw new NotFoundException({ id }, `Equipe ${id} não encontrada`);
    }

    await this.ligaService.excecaoSeALigaEstaIniciada(resultado.idLiga);
    await this.equipeRepository.delete(id);
  }
}
