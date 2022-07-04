import { PontuacaoDto } from './pontuacao.dto';

export interface IAplicaRegraDesempateDto {
  idLiga: string;
  classificacoes: PontuacaoDto[];
}
