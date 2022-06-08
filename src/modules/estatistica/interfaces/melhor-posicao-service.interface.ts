export interface IMelhorPosicaoService<T> {
  listaMelhoresDaLiga(idLiga: string): Promise<T[]>;
}
