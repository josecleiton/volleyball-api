import { Injectable, Scope } from '@nestjs/common';
import { LigaService } from 'src/modules/competicao/liga.service';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import {
  ArbitroRespostaDto,
  CriaArbitroDto,
  ListaArbitroDto,
} from '../dto/arbitro.dto';
import { ArbitroRepository } from '../repositories/arbitro.repository';

@Injectable({ scope: Scope.REQUEST })
export class ArbitroService {
  constructor(
    private readonly arbitroRepository: ArbitroRepository,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly ligaService: LigaService,
  ) {}

  async criaArbitro(requisicao: CriaArbitroDto) {
    const liga = await this.ligaService.deveEncontrarUm(requisicao.idLiga);
    const arbitro = this.arbitroRepository.create({
      ...requisicao,
      idLiga: liga.id,
      pessoa: requisicao.paraPessoa(),
    });

    try {
      return new ArbitroRespostaDto(await this.arbitroRepository.save(arbitro));
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Arbitro',
      });
    }
  }

  async listaArbitros(requisicao: ListaArbitroDto) {
    const arbitros = await this.arbitroRepository.find({
      where: { ...requisicao },
    });

    return arbitros.map((x) => new ArbitroRespostaDto(x));
  }
}
