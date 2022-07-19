import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeORMFilterService } from 'src/modules/core';
import { EquipeService } from 'src/modules/equipe';
import { LigaService } from 'src/modules/liga';
import { CriaAuxiliarDto, AuxiliarRespostaDto, ListaAuxiliarDto } from '../dto';
import { TipoPessoa } from '../enums';
import { dtoParaPessoa } from '../mapper';
import { AuxiliarRepository } from '../repositories';

@Injectable()
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
      pessoa: dtoParaPessoa(requisicao, TipoPessoa.auxiliar),
    });

    try {
      return new AuxiliarRespostaDto(
        await this.auxiliarRepository.save(auxiliar),
      );
    } catch (error) {
      throw this.typeormFilterService.catch({
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
