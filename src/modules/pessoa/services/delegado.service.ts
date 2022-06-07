import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import {
  CriaDelegadoDto,
  DelegadoRespostaDto,
  ListaDelegadoDto,
} from '../dto/delegado.dto';
import { DelegadoRepository } from '../repositories/delegado.repository';
import { TipoPessoa } from '../enums';

@Injectable({ scope: Scope.REQUEST })
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
      pessoa: requisicao.paraPessoa(TipoPessoa.delegado),
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
    const delegado = await this.delegadoRepository.findOne(id);
    if (!delegado) {
      throw new NotFoundException(`Delegado ${id} não encontrado`);
    }

    return new DelegadoRespostaDto(delegado);
  }
}
