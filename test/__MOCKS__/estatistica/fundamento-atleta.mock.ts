import { CriaFundamentoAtletaDto } from 'src/modules/estatistica/dto/fundamento-atleta.dto';

export function criaFundamentoAtleta(
  idPartida: string,
  idAtleta: string,
  bloqueios?: number,
  recepcoes?: number,
  aces?: number,
  saques?: number,
  ataques?: number,
  pontos?: number,
): CriaFundamentoAtletaDto {
  return Object.assign(new CriaFundamentoAtletaDto(), {
    idPartida,
    idAtleta,
    bloqueios,
    recepcoes,
    aces,
    saques,
    ataques,
    pontos,
  });
}
