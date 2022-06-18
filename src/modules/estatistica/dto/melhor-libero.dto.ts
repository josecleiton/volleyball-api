// import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { MelhorLiberoView } from '../entities/melhor-libero-view.entity';

export class MelhorLiberoRespostaDto {
  idAtleta: string;
  recepcoesPorPartida: number;
  quantidadeDePartidas: number;
  atleta: AtletaRespostaDto;

  public get totalDeRecepcoes(): number {
    return this.recepcoesPorPartida * this.quantidadeDePartidas;
  }

  constructor(ml: MelhorLiberoView) {
    this.idAtleta = ml.idAtleta;
    this.recepcoesPorPartida = ml.recepcoesPorPartida;
    this.quantidadeDePartidas = ml.quantidadePartidas;
    this.atleta = new AtletaRespostaDto(ml.atleta);
  }
}
