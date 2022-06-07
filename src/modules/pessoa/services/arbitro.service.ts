import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import {
  ArbitroRespostaDto,
  CriaArbitroDto,
  ListaArbitroDto,
} from '../dto/arbitro.dto';
import { ArbitroRepository } from '../repositories/arbitro.repository';
import { TipoPessoa } from '../enums';
import { In } from 'typeorm';

@Injectable()
export class ArbitroService {
  constructor(
    private readonly arbitroRepository: ArbitroRepository,
    private readonly typeormFilterService: TypeORMFilterService,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
  ) {}

  async criaArbitro(requisicao: CriaArbitroDto) {
    const liga = await this.ligaService.deveEncontrarUm(requisicao.idLiga);
    const arbitro = this.arbitroRepository.create({
      ...requisicao,
      idLiga: liga.id,
      pessoa: requisicao.paraPessoa(TipoPessoa.arbitro),
    });

    try {
      return new ArbitroRespostaDto(await this.arbitroRepository.save(arbitro));
    } catch (error) {
      throw this.typeormFilterService.catch({
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

  async deveListarPorId(ids: string[]) {
    const arbitros = await this.arbitroRepository.find({
      where: { id: In(ids) },
    });
    const setId = new Set(ids);

    const naoEncontrados = arbitros.filter((x) => !setId.has(x.id));
    if (naoEncontrados?.length) {
      throw new NotFoundException(naoEncontrados);
    }
    return arbitros.map((x) => new ArbitroRespostaDto(x));
  }
}
