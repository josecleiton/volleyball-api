import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { CraqueDaGaleraView } from '../entities/craque-da-galera.entity';

export class CraqueDaGaleraRespostaDto {
  idAtleta: string;
  quantidadeVotos: number;
  atleta: AtletaRespostaDto;

  constructor(cg: CraqueDaGaleraView) {
    this.idAtleta = cg.idAtleta;
    this.quantidadeVotos = cg.quantidadeVotos;
    this.atleta = new AtletaRespostaDto(cg.atleta);
  }
}
