import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { MelhorPontaView } from '../entities/melhor-ponta-view.entity';

export class MelhorPontaRespostaDto {
  idAtleta: string;
  acesPorPartida: number;
  saquesEfetivos: number;
  atleta: AtletaRespostaDto;
  quantidadeDePartidas: number;

  public get totalDeAces(): number {
    return this.acesPorPartida * this.quantidadeDePartidas;
  }

  constructor(m: MelhorPontaView) {
    this.idAtleta = m.idAtleta;
    this.acesPorPartida = m.acesPorPartida;
    this.saquesEfetivos = m.saquesEfetivos;
    this.quantidadeDePartidas = m.quantidadePartidas;
    this.atleta = new AtletaRespostaDto(m.atleta);
  }
}
