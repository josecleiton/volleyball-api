import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeORMFilterService } from '../core/services/typeorm-filter.service';
import {
  CriaGinasioDto,
  GinasioRespostaDto,
  ListaGinasiosDto,
} from './dto/ginasio.dto';
import { GinasioRepository } from './repositories/ginasio.repository';

@Injectable()
export class GinasioService {
  constructor(
    private readonly ginasioRepository: GinasioRepository,
    private readonly ormFilterService: TypeORMFilterService,
  ) {}

  async criaGinasio(requisicao: CriaGinasioDto) {
    const ginasio = this.ginasioRepository.create({ ...requisicao });
    try {
      return await this.ginasioRepository.save(ginasio);
    } catch (error) {
      throw this.ormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Ginasio',
      });
    }
  }

  async listaGinasio(requisicao: ListaGinasiosDto) {
    return this.ginasioRepository.listaFiltrando(requisicao);
  }

  async devePegarUm(id: string) {
    const ginasio = await this.ginasioRepository.findOne(id);
    if (!ginasio) {
      throw new NotFoundException(`Ginásio ${id} não encontrado`);
    }

    return new GinasioRespostaDto(ginasio);
  }

  async removeGinasio(id: string) {
    const resultado = await this.ginasioRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Ginásio ${id} não encontrado`);
    }
  }
}
