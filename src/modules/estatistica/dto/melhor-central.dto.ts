import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { MelhorCentralView } from '../entities/melhor-central-view.entity';

export class MelhorCentralRespostaDto {
  idAtleta: string;
  bloqueios: number;
  atleta: AtletaRespostaDto;

  constructor(m: MelhorCentralView) {
    this.idAtleta = m.idAtleta;
    this.bloqueios = m.bloqueios;
    this.atleta = new AtletaRespostaDto(m.atleta);
  }
}
