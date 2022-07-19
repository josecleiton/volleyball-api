import { EquipeSimplificadaRespostaDto } from 'src/modules/equipe';
import { EquipePartida } from '../entities';
import { IPontoNoSet } from '../interfaces';
import { AtletaEscaladoComPerfilAtletaRespostaDto } from './atleta-escalado.dto';

export class EquipePartidaRespostaDto {
  id: string;
  idEquipe: string;
  idPartida?: string;
  pontuacao: number;
  setsGanhos: number;
  resultadoCadastradoEm?: Date;
  pontosNosSets: number[];
  equipe: EquipeSimplificadaRespostaDto;
  quantidadeAtletasEscalados: number;
  atletas: AtletaEscaladoComPerfilAtletaRespostaDto[];

  public get setsJogados() {
    return this.pontosNosSets.length;
  }

  constructor(e: EquipePartida) {
    this.id = e.id;
    this.idEquipe = e.idEquipe;
    this.idPartida = e.idPartida;
    this.pontuacao = e.pontuacao;
    this.setsGanhos = e.setsGanhos;
    this.pontosNosSets = e.pontosNosSets.map((x) => x.quantidade);
    this.resultadoCadastradoEm = e.resultadoCadastradoEm;
    this.equipe = new EquipeSimplificadaRespostaDto(e.equipe);
    this.quantidadeAtletasEscalados = e.atletas?.length ?? 0;
    this.atletas =
      e.atletas?.map((x) => new AtletaEscaladoComPerfilAtletaRespostaDto(x)) ??
      [];
  }
}

export class EquipePartidaRespostaSimplificadoDto {
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
