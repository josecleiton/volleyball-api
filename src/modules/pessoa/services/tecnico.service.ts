import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CriaTecnicoDto, TecnicoRespostaDto } from '../dto/tecnico.dto';
import { TecnicoRepository } from '../repositories/tecnico.repository';

@Injectable({ scope: Scope.REQUEST })
export class TecnicoService {
  constructor(private readonly tecnicoRepository: TecnicoRepository) {}

  async createTecnico(requisicao: CriaTecnicoDto) {
    const tecnico = Object.assign(this.tecnicoRepository.create(), requisicao);
    tecnico.pessoa = requisicao.paraPessoa();

    return new TecnicoRespostaDto(await this.tecnicoRepository.save(tecnico));
  }

  async devePegarTecnico(id: string) {
    const tecnico = await this.tecnicoRepository.findOne(id);
    if (!tecnico) {
      throw new NotFoundException(`Tecnico ${id} não encontrado`);
    }

    return new TecnicoRespostaDto(tecnico);
  }
}
