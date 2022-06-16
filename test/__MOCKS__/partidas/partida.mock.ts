import faker = require('faker');
import { Liga } from 'src/modules/liga/entities/liga.entity';
import {
  ArbitroPartidaDto,
  AtletaParticipacaoDto,
  CadastrarParticipantesPartidaDto,
  EscolhaDeDesistencia,
  ListaPartidasDto,
} from 'src/modules/partida/dto/partida.dto';
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
