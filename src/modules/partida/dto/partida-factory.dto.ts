import { Equipe } from 'src/modules/equipe';
import { TipoRodada } from '../types';

export interface IPartidaFactoryDto {
  dataComeco: Date;
  equipeMandante: Equipe;
  equipeVisitante: Equipe;
  tipoDaRodada: TipoRodada;
}
