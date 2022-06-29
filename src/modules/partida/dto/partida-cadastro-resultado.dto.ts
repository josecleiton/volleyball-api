import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';
import { EquipePartida } from '../entities/equipe-partida.entity';
import { IPontoNoSet } from '../interfaces/ponto_no_set.interface';

export class CadastrarResultadoPartidaDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  setsMandante!: number[];

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  setsVisitante!: number[];
}

export class EquipePartidaRespostaDto {
  idEquipe: string;
  idPartida?: string;
  pontuacao: number;
  setsGanhos: number;
  pontosNosSets: IPontoNoSet[];
  setsDisputados: number;
  ganhou: boolean;
  resultadoCadastradoEm?: Date;

  constructor(e: EquipePartida) {
    this.idEquipe = e.idEquipe;
    this.idPartida = e.idPartida;
    this.setsDisputados = e.setsDisputados;
    this.pontuacao = e.pontuacao;
    this.setsGanhos = e.setsGanhos;
    this.pontosNosSets = e.pontosNosSets;
    this.ganhou = e.ganhou;
    this.resultadoCadastradoEm = e.resultadoCadastradoEm;
  }
}
