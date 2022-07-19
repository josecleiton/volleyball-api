import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { TypeORMFilterService } from 'src/modules/core';
import { LigaService } from 'src/modules/liga';
import { CriaDelegadoDto, DelegadoRespostaDto, ListaDelegadoDto } from '../dto';
import { TipoPessoa } from '../enums';
import { dtoParaPessoa } from '../mapper';
import { DelegadoRepository } from '../repositories';

@Injectable()
export class DelegadoService {
  constructor(
    private readonly delegadoRepository: DelegadoRepository,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
    private readonly typeormFilterService: TypeORMFilterService,
  ) {}

  async criaDelegado(requisicao: CriaDelegadoDto) {
    const liga = await this.ligaService.deveEncontrarUm(requisicao.idLiga);
    const delegado = this.delegadoRepository.create({
      ...requisicao,
      idLiga: liga.id,
      pessoa: dtoParaPessoa(requisicao, TipoPessoa.delegado),
    });

    try {
      return new DelegadoRespostaDto(
        await this.delegadoRepository.save(delegado),
      );
    } catch (error) {
      throw this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Delegado',
      });
    }
  }

  async listaDelegados(requisicao: ListaDelegadoDto) {
    const delegados = await this.delegadoRepository.find({
      where: { ...requisicao },
    });

    return delegados.map((x) => new DelegadoRespostaDto(x));
  }

  async deveEncontrarUm(id: string) {
    const delegado = await this.delegadoRepository.findOne({ where: { id } });
    if (!delegado) {
      throw new NotFoundException(`Delegado ${id} não encontrado`);
    }

    return new DelegadoRespostaDto(delegado);
  }
}
