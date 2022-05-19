import {
  Injectable,
  NotFoundException,
  NotImplementedException,
  Scope,
} from '@nestjs/common';
import { TypeORMFilterService } from '../core/services/typeorm-filter.service';
import {
  CriaLigaDto,
  InicializaLigaDto,
  LigaRespostaDto,
} from './dto/liga.dto';
import { LigaRepository } from './liga.repository';

@Injectable({ scope: Scope.REQUEST })
export class LigaService {
  constructor(
    private readonly ligaRepository: LigaRepository,
    private readonly typeormFilterService: TypeORMFilterService,
  ) {}

  async cria(requisicao: CriaLigaDto) {
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

  async iniciaLiga(requisicao: InicializaLigaDto) {
    throw new NotImplementedException(requisicao);
  }

  async lista() {
    return this.ligaRepository.find({ order: { dataCriacao: 'DESC' } });
  }

  private async devePegarEntidade(id: string) {
    const liga = await this.ligaRepository.findOne(id);
    if (!liga) {
      throw new NotFoundException(`Liga ${id} não encontrada`);
    }

    return liga;
  }

  async devePegarUm(id: string) {
    return new LigaRespostaDto(await this.devePegarEntidade(id));
  }

  async remove(id: string) {
    const resultado = await this.ligaRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Liga ${id} não encontrada`);
    }
  }
}
