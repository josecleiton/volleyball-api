import { Partida, EscolhaDeDesistencia } from 'src/modules/partida';

export interface IRegistraDesistenciaDto {
  partida: Partida;
  desistente: EscolhaDeDesistencia;
}
