import { PontuacaoRespostaDto } from './pontuacao.dto';

export interface IAplicaRegraDesempateDto {
  idLiga: string;
  classificacoes: PontuacaoRespostaDto[];
}
