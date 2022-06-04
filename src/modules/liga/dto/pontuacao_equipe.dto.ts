export interface IPontuacaoDto {
  pontuacao: number;
  id: string;
}

export interface IEquipePontuacaoDto {
  id: string;
  nome: string;
  idLiga: string;
  idGinasio: string;
}

export interface IListaPontuacaoDaLigaOrdenadaResposta {
  equipeId: string;
  equipeNome: string;
  equipeIdGinasio: string;
  ligaId: string;
  pontuacao: number;
}

export class PontuacaoEquipeRespostaDto {
  pontuacao: number;
  equipe: IEquipePontuacaoDto;

  constructor(
    pontuacaoOrdenadaResposta: IListaPontuacaoDaLigaOrdenadaResposta,
  ) {
    this.pontuacao = pontuacaoOrdenadaResposta.pontuacao;
    this.equipe = {
      id: pontuacaoOrdenadaResposta.equipeId,
      idLiga: pontuacaoOrdenadaResposta.ligaId,
      nome: pontuacaoOrdenadaResposta.equipeNome,
      idGinasio: pontuacaoOrdenadaResposta.equipeIdGinasio,
    };
  }
}
