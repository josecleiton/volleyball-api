import { Injectable, Scope } from '@nestjs/common';
import { LigaService } from 'src/modules/competicao/liga.service';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import {
  CriaDelegadoDto,
  DelegadoRespostaDto,
  ListaDelegadoDto,
} from '../dto/delegado.dto';
import { DelegadoRepository } from '../repositories/delegado.repository';

@Injectable({ scope: Scope.REQUEST })
export class DelegadoService {
  constructor(
    private readonly delegadoRepository: DelegadoRepository,
    private readonly ligaService: LigaService,
    private readonly typeormFilterService: TypeORMFilterService,
  ) {}

  async criaDelegado(requisicao: CriaDelegadoDto) {
    const liga = await this.ligaService.deveEncontrarUm(requisicao.idLiga);
    const arbitro = this.delegadoRepository.create({
      ...requisicao,
      idLiga: liga.id,
      pessoa: requisicao.paraPessoa(),
    });

    try {
      return new DelegadoRespostaDto(
        await this.delegadoRepository.save(arbitro),
      );
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Delegado',
      });
    }
  }

  async listaDelegados(requisicao: ListaDelegadoDto) {
    const arbitros = await this.delegadoRepository.find({
      where: { ...requisicao },
    });

    return arbitros.map((x) => new DelegadoRespostaDto(x));
  }
}
