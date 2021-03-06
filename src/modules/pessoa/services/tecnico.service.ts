import { Injectable, NotFoundException } from '@nestjs/common';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import { EquipeService } from 'src/modules/equipe/equipe.service';
import { CriaTecnicoDto, TecnicoRespostaDto } from '../dto/tecnico.dto';
import { TecnicoRepository } from '../repositories/tecnico.repository';
import { TipoPessoa } from '../enums';
import { dtoParaPessoa } from '../mapper';

@Injectable()
export class TecnicoService {
  constructor(
    private readonly tecnicoRepository: TecnicoRepository,
    private readonly equipeService: EquipeService,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly ligaService: LigaService,
  ) {}

  async createTecnico(requisicao: CriaTecnicoDto) {
    const equipe = await this.equipeService.deveEncontrarUm(
      requisicao.idEquipe,
    );
    await this.ligaService.excecaoSeALigaEstaIniciada(equipe.idLiga);
    const tecnico = this.tecnicoRepository.create({
      ...requisicao,
      idEquipe: equipe.id,
      pessoa: dtoParaPessoa(requisicao, TipoPessoa.tecnico),
    });

    try {
      return new TecnicoRespostaDto(await this.tecnicoRepository.save(tecnico));
    } catch (error) {
      throw this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Tecnico',
      });
    }
  }

  async devePegarEntidade(id: string) {
    const tecnico = await this.tecnicoRepository.findOne({
      where: { id },
    });
    if (!tecnico) {
      throw new NotFoundException(`Tecnico ${id} não encontrado`);
    }

    return tecnico;
  }

  async deveEncontrarUm(id: string) {
    return new TecnicoRespostaDto(await this.devePegarEntidade(id));
  }
}
