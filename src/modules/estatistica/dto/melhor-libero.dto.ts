// import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { MelhorLiberoView } from '../entities/melhor-libero-view.entity';

export class MelhorLiberoRespostaDto {
  idAtleta: string;
  recepcoes: number;
  // atleta: AtletaRespostaDto;

  constructor(ml: MelhorLiberoView) {
    this.idAtleta = ml.idAtleta;
    this.recepcoes = ml.recepcoes;
    // this.atleta = new AtletaRespostaDto(ml.atleta);
  }
}
