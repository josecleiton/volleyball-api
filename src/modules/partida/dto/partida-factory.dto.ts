import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { TipoRodada } from '../types/tipo-rodada.type';

export interface IPartidaFactoryDto {
  dataComeco: Date;
  equipeMandante: Equipe;
  equipeVisitante: Equipe;
  tipoDaRodada: TipoRodada;
}
