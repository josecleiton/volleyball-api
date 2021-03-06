import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In } from 'typeorm';
import { LigaService } from '../liga/services/liga.service';
import { TypeORMFilterService } from '../core/services/typeorm-filter.service';
import { GinasioService } from '../ginasio/ginasio.service';
import {
  AtualizaEquipeDto,
  CriaEquipeDto,
  EquipeRespostaDto,
  EquipeSimplificadaRespostaDto,
  ListaEquipesDto,
} from './dto/equipe.dto';
import { Equipe } from './entities/equipe.entity';
import { EquipeRepository } from './equipe.repository';
import { VerificaUrlService } from '../core/services/verifica-url.service';

@Injectable()
export class EquipeService {
  constructor(
    private readonly equipeRepository: EquipeRepository,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
    private readonly ginasioService: GinasioService,
    private readonly ormFilterService: TypeORMFilterService,
    private readonly verificaUrlService: VerificaUrlService,
  ) {}

  async criaEquipe(request: CriaEquipeDto) {
    await this.ligaService.excecaoSeALigaEstaIniciada(request.idLiga);
    await this.ginasioService.devePegarUm(request.idGinasio);

    if (request.urlBrasao) {
      await this.verificaUrlService.ehImagem(request.urlBrasao);
    }

    try {
      const equipe = this.equipeRepository.create({ ...request });
      equipe.atletas = [];
      equipe.auxiliares = [];
      return new EquipeRespostaDto(await this.equipeRepository.save(equipe));
    } catch (e) {
      throw this.ormFilterService.catch({
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
    const equipes = await this.equipeRepository.find({
      where: request,
      order: { dataCriacao: 'ASC' },
      relations: { atletas: true, auxiliares: true, tecnico: true },
    });
    return equipes.map((x) => new EquipeRespostaDto(x));
  }

  async deveEncontrarEntidade(id: string) {
    const equipe = await this.equipeRepository.findOne({
      where: { id },
      relations: { atletas: true, auxiliares: true, tecnico: true },
    });
    if (!equipe) {
      throw new NotFoundException(`Equipe ${id} não encontrada`);
    }

    return equipe;
  }

  async deveEncontrarUm(id: string) {
    return new EquipeRespostaDto(await this.deveEncontrarEntidade(id));
  }

  async deveEncontrarSimplificada(
    id: string,
  ): Promise<EquipeSimplificadaRespostaDto> {
    const equipe = await this.equipeRepository.findOne({
      where: { id },
      relations: { atletas: true },
      select: { id: true, idLiga: true, idGinasio: true, nome: true },
    });
    if (!equipe) {
      throw new NotFoundException(`Equipe ${id} não encontrada`);
    }

    return new EquipeSimplificadaRespostaDto(equipe);
  }

  async deveEncontrarEquipes(ids: string[], take?: number, mesmaLiga = true) {
    const equipes = await this.equipeRepository.find({
      where: {
        id: In(ids),
      },
      take,
    });
    if (equipes.length != ids.length) {
      const equipeIdSet = new Set(equipes.map((x) => x.id));
      const equipesFaltantes = ids.filter((id) => !equipeIdSet.has(id));
      throw new NotFoundException(
        `Ids de equipes não encontradas: ${equipesFaltantes}`,
      );
    }
    if (mesmaLiga && equipes.every((x) => x.idLiga == equipes[0].idLiga)) {
      throw new NotFoundException('Equipes não estão na mesma liga');
    }

    return equipes.map((x) => new EquipeRespostaDto(x));
  }

  async atualizaEquipe(id: string, requisicao: AtualizaEquipeDto) {
    const equipe = await this.deveEncontrarEntidade(id);
    await this.ligaService.excecaoSeALigaEstaIniciada(equipe.idLiga);

    if (requisicao.nome) {
      equipe.nome = requisicao.nome;
    }
    if (requisicao.urlBrasao) {
      await this.verificaUrlService.ehImagem(requisicao.urlBrasao);
      equipe.urlBrasao = requisicao.urlBrasao;
    }
    if (requisicao.idGinasio && requisicao.idGinasio !== equipe.idGinasio) {
      await this.ginasioService.devePegarUm(requisicao.idGinasio);
    }

    return new EquipeRespostaDto(await this.equipeRepository.save(equipe));
  }

  async remove(id: string) {
    const resultado: { id: string; idLiga: string } | null =
      await this.equipeRepository.findOne({
        where: { id },
        select: { id: true, idLiga: true },
      });
    if (!resultado) {
      throw new NotFoundException({ id }, `Equipe ${id} não encontrada`);
    }

    await this.ligaService.excecaoSeALigaEstaIniciada(resultado.idLiga);
    await this.equipeRepository.delete(id);
  }
}
