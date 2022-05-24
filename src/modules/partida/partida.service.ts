import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  Scope,
} from '@nestjs/common';
import { PartidaRespostaDto } from './dto/partida.dto';
import { PartidaStatus } from './enums/partida-status.enum';
import { PartidaRepository } from './repositories/partida.repository';

@Injectable({ scope: Scope.REQUEST })
export class PartidaService {
  constructor(private readonly partidaRepository: PartidaRepository) {}

  async listaPartidas() {
    throw new NotImplementedException();
  }

  private async deveEncontrarEntidade(id: string) {
    const partida = await this.partidaRepository.findOne({
      where: { id },
    });
    if (!partida) {
      throw new NotFoundException(`Partida ${id} não encontrada`);
    }

    return partida;
  }

  async trocaStatus(id: string, status: PartidaStatus) {
    const partida = await this.deveEncontrarEntidade(id);

    switch ([partida.status, status]) {
      case [PartidaStatus.AGENDADA, PartidaStatus.EM_ANDAMENTO]:
        partida.dataComeco = new Date();
        break;

      case [PartidaStatus.EM_ANDAMENTO, PartidaStatus.CONCLUIDA]:
        partida.dataFinalizacao = new Date();
        throw new NotImplementedException();

      default:
        throw new ConflictException(
          `Partida ${id} não pode sair de ${partida.status} -> ${status}`,
        );
    }

    return new PartidaRespostaDto(await this.partidaRepository.save(partida));
  }
}
