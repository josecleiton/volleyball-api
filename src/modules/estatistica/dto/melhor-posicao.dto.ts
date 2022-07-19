import { EquipeSimplificadaRespostaDto } from 'src/modules/equipe';
import { AtletaRespostaDto, Atleta } from 'src/modules/pessoa';

export abstract class MelhorPosicaoRespostaDto {
  idAtleta: string;
  atleta: AtletaRespostaDto;
  equipe: EquipeSimplificadaRespostaDto;

  constructor(atleta: Atleta) {
    this.idAtleta = atleta.id;
    this.atleta = new AtletaRespostaDto(atleta);
    this.equipe = new EquipeSimplificadaRespostaDto(atleta.equipe);
  }
}
