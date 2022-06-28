import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { CraqueDaGaleraView } from '../entities/craque-da-galera-view.entity';

export class CraqueDaGaleraRespostaDto {
  idAtleta: string;
  quantidadeVotos: number;
  atleta: AtletaRespostaDto;

  constructor(cg: CraqueDaGaleraView) {
    this.idAtleta = cg.idAtleta;
    this.quantidadeVotos = parseInt(cg.quantidadeVotos);
    this.atleta = new AtletaRespostaDto(cg.atleta);
  }
}
