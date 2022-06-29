import { EquipeSimplificadaRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';

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
