import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import { EquipeService } from 'src/modules/equipe/equipe.service';
import { LigaService } from 'src/modules/liga/liga.service';
import {
  AuxiliarRespostaDto,
  CriaAuxiliarDto,
  ListaAuxiliarDto,
} from '../dto/auxiliar.dto';
import { TipoPessoa } from '../enums';
import { AuxiliarRepository } from '../repositories/auxiliar.repository';

@Injectable({ scope: Scope.REQUEST })
export class AuxiliarService {
  constructor(
    private readonly auxiliarRepository: AuxiliarRepository,
    private readonly equipeService: EquipeService,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly ligaService: LigaService,
  ) {}

  async criaAuxiliar(requisicao: CriaAuxiliarDto) {
    const equipe = await this.equipeService.deveEncontrarUm(
      requisicao.idEquipe,
    );
    await this.ligaService.excecaoSeALigaEstaIniciada(equipe.idLiga);
    const auxiliar = this.auxiliarRepository.create({
      ...requisicao,
      idEquipe: equipe.id,
      pessoa: requisicao.paraPessoa(TipoPessoa.auxiliar),
    });

    try {
      return new AuxiliarRespostaDto(
        await this.auxiliarRepository.save(auxiliar),
      );
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Auxiliar',
      });
    }
  }

  async listaAuxiliares(requisicao: ListaAuxiliarDto) {
    const auxiliares = await this.auxiliarRepository.find({
      where: { ...requisicao },
    });

    return auxiliares.map((x) => new AuxiliarRespostaDto(x));
  }

  async devePegarEntidade(id: string) {
    const tecnico = await this.auxiliarRepository.findOne({
      where: { id },
    });
    if (!tecnico) {
      throw new NotFoundException(`Auxiliar ${id} não encontrado`);
    }

    return tecnico;
  }

  async devePegarUm(id: string) {
    return new AuxiliarRespostaDto(await this.devePegarEntidade(id));
  }
}
