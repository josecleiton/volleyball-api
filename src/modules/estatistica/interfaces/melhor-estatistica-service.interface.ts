export interface IMelhorEstatisticaService<T> {
  listaMelhoresDaLiga(idLiga: string): Promise<T[]>;
}
