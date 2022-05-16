import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TypeORMFilterService } from '../core/services/typeorm-filter.service';
import {
  AtualizaEquipeDto,
  CriaEquipeDto,
  EquipeRespostaDto,
} from './dto/equipe.dto';
import { EquipeRepository } from './equipe.repository';

@Injectable({ scope: Scope.REQUEST })
export class EquipeService {
  constructor(
    private readonly equipeRepository: EquipeRepository,
    private readonly ormFilterService: TypeORMFilterService,
  ) {}

  async criaEquipe(request: CriaEquipeDto) {
    try {
      return new EquipeRespostaDto(
        await this.equipeRepository.save(this.equipeRepository.create(request)),
      );
    } catch (e) {
      this.ormFilterService.catch({
        error: e,
        entityName: 'Equipe',
        description: 'nome já utilizado',
      });
    }
  }

  async listaEquipes() {
    return this.equipeRepository.find();
  }

  async deveEncontrarUm(id: string) {
    const equipe = await this.equipeRepository.findOne(id);
    if (!equipe) {
      throw new NotFoundException(`Equipe ${id} não encontrada`);
    }

    return new EquipeRespostaDto(equipe);
  }

  async atualizaEquipe(id: string, request: AtualizaEquipeDto) {
    const equipe = await this.deveEncontrarUm(id);
    if (request.nome) {
      equipe.nome = request.nome;
    }
    if (request.urlBrasao) {
      equipe.urlBrasao = request.urlBrasao;
    }

    return new EquipeRespostaDto(await this.equipeRepository.save(equipe));
  }

  async remove(id: string) {
    const resultado = await this.equipeRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException({ id }, `Equipe ${id} não encontrada`);
    }
  }
}
