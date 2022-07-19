import { Partida } from '../entities';

export interface IRegistraEquipeGanhadoraDto {
  partida: Partida;
  pontuacaoVisitante: number;
  pontuacaoMandante: number;
  setsGanhosMandante: number;
  setsMandante: number[];
  setsGanhosVisitante: number;
  setsVisitante: number[];
  wo?: boolean;
}
