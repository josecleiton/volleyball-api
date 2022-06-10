import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { MelhorCentralView } from '../entities/melhor-central-view.entity';

export class MelhorCentralRespostaDto {
  idAtleta: string;
  bloqueiosPorPartida: number;
  atleta: AtletaRespostaDto;
  quantidadeDePartidas: number;

  public get totalDeBloqueios(): number {
    return this.bloqueiosPorPartida * this.quantidadeDePartidas;
  }

  constructor(m: MelhorCentralView) {
    this.idAtleta = m.idAtleta;
    this.bloqueiosPorPartida = m.bloqueiosPorPartida;
    this.quantidadeDePartidas = m.quantidadePartidas;
    this.atleta = new AtletaRespostaDto(m.atleta);
  }
}
