import { EscolhaDeDesistencia } from 'src/modules/partida/dto/partida.dto';
import { Partida } from 'src/modules/partida/entities/partida.entity';

export interface IRegistraDesistenciaDto {
  partida: Partida;
  desistente: EscolhaDeDesistencia;
}
