
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { TipoRodada } from 'src/modules/partida/types/tipo-rodada.type';
import { PontuacaoView } from '../entities/pontuacao-view.entity';

export class PontuacaoRespostaDto {
  idEquipe: string;
  setsGanhos: number;
  setsPerdidos: number;
  setsDisputados: number;
  partidasGanhas: number;
  partidasPerdidas: number;
  partidasDisputadas: number;
  pontuacao: number;
  pontosAverage: number;
  setsAverage: number;
  pontuacao:number

  equipe: EquipeRespostaDto;

  constructor(p: PontuacaoView) {
    this.idEquipe = p.idEquipe;
    this.setsGanhos = p.setsGanhos;
    this.setsPerdidos = p.setsPerdidos;
    this.setsDisputados = p.setsDisputados;
    this.partidasGanhas = p.partidasGanhas;
    this.partidasPerdidas = p.partidasPerdidas;
    this.partidasDisputadas = p.partidasDisputadas;
    this.pontuacao = p.pontuacao;
    this.pontosAverage = p.pontosAverage;
    this.setsAverage = p.setsAverage;

   this.equipe = new EquipeRespostaDto(p.equipe);
  }



}

export interface ITrocarOrdemPontuacoes {

    indexAnterior: number;
    indexProximo: number;

}

export interface IBuscarConfrontoEquipes{
  idTime1:string;
  idTime2:string;
  tipoRodadas:TipoRodada[]

}

export interface IAplicarCriterioDePontuacao{
    a:number
    b:number
    indexAnterior: number;
    indexProximo: number;
}