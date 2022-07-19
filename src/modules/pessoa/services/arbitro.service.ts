import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { TypeORMFilterService } from 'src/modules/core';
import { LigaService } from 'src/modules/liga';
import { In } from 'typeorm';
import { CriaArbitroDto, ArbitroRespostaDto, ListaArbitroDto } from '../dto';
import { TipoPessoa } from '../enums';
import { dtoParaPessoa } from '../mapper';
import { ArbitroRepository } from '../repositories';

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
      pessoa: dtoParaPessoa(requisicao, TipoPessoa.arbitro),
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

  async deveListarEstritatemente(ids: string[]) {
    const arbitros = await this.arbitroRepository.findBy({ id: In(ids) });
    const setId = new Set(ids);

    const naoEncontrados = arbitros.filter((x) => !setId.has(x.id));
    if (arbitros.length !== setId.size || naoEncontrados?.length) {
      throw new NotFoundException(`Arbitros ${naoEncontrados}`);
    }

    return arbitros.map((x) => new ArbitroRespostaDto(x));
  }
}
