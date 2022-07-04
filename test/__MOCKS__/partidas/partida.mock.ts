import faker = require('faker');
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { CadastrarResultadoPartidaDto } from 'src/modules/partida/dto/partida-cadastro-resultado.dto';
import { ListaPartidasDto } from 'src/modules/partida/dto/partida.dto';
import {
  TipoRodada,
  tiposDeRodadaClassificatoria,
} from 'src/modules/partida/types/tipo-rodada.type';

export function listaPartidasDto(
  idLiga: string,
  tipoRodada?: TipoRodada,
  limite = Liga.quantidadeDePartidasEmRodadaClassificatoria,
): ListaPartidasDto {
  return Object.assign(new ListaPartidasDto(), {
    idLiga,
    tipoRodada:
      tipoRodada ?? faker.random.arrayElement(tiposDeRodadaClassificatoria),
    limite,
  });
}

export function cadastrarResultadoPartidaDto(): CadastrarResultadoPartidaDto {
  const mandanteVence = faker.datatype.boolean();
  const vencedor = [25, 25, 25];
  const perdedor = [...Array(3).keys()].map(() =>
    faker.datatype.number({ min: 0, max: 23 }),
  );

  return Object.assign(new CadastrarResultadoPartidaDto(), {
    setsMandante: mandanteVence ? vencedor : perdedor,
    setsVisitante: mandanteVence ? perdedor : vencedor,
  });
}

export function cadastrarResultadoPartidaMd3(): [
  CadastrarResultadoPartidaDto,
  CadastrarResultadoPartidaDto,
] {
  const resultado = cadastrarResultadoPartidaDto();

  return [
    resultado,
    {
      setsMandante: resultado.setsVisitante,
      setsVisitante: resultado.setsMandante,
    },
  ];
}
