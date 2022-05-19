import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import { EquipeService } from 'src/modules/equipe/equipe.service';
import { CriaTecnicoDto, TecnicoRespostaDto } from '../dto/tecnico.dto';
import { TecnicoRepository } from '../repositories/tecnico.repository';

@Injectable({ scope: Scope.REQUEST })
export class TecnicoService {
  constructor(
    private readonly tecnicoRepository: TecnicoRepository,
    private readonly equipeService: EquipeService,
    private readonly typeormFilterService: TypeORMFilterService,
  ) {}

  async createTecnico(requisicao: CriaTecnicoDto) {
    const equipe = await this.equipeService.deveEncontrarUm(
      requisicao.idEquipe,
    );
    const tecnico = this.tecnicoRepository.create({
      ...requisicao,
      idEquipe: equipe.id,
      pessoa: requisicao.paraPessoa(),
    });

    try {
      return new TecnicoRespostaDto(await this.tecnicoRepository.save(tecnico));
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Tecnico',
      });
    }
  }

  async devePegarEntidade(id: string) {
    const tecnico = await this.tecnicoRepository.findOne({
      relations: ['pessoa'],
      where: { id },
    });
    if (!tecnico) {
      throw new NotFoundException(`Tecnico ${id} não encontrado`);
    }

    return tecnico;
  }

  async devePegarUm(id: string) {
    return new TecnicoRespostaDto(await this.devePegarEntidade(id));
  }
}
