/* eslint-disable no-await-in-loop */
import request = require('supertest');
import { chunk, last } from 'lodash';

import { sleep } from 'src/modules/core/utils';
import {
  LigaRespostaDto,
  SemisLigaRespostaDto,
} from 'src/modules/liga/dto/liga.dto';
import { inicializaSemiFinalDto } from 'test/__MOCKS__/liga/tabela.dto';
import { IInicializaFinais } from './helpers/inicializa-finais.interface';
import { LigaQuartasDeFinalServer } from './liga-quartas-de-final.server';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { cadastrarResultadoPartidaMd3 } from 'test/__MOCKS__/partidas/partida.mock';

export class LigaFinaisServer {
  readonly liga: LigaQuartasDeFinalServer;
  constructor(private readonly server: unknown) {
    this.liga = new LigaQuartasDeFinalServer(this.server);
  }

  private async jogaMd3(liga: LigaRespostaDto, partidas: PartidaRespostaDto[]) {
    expect(partidas).toHaveLength(3);

    const resultado = cadastrarResultadoPartidaMd3();

    for (let index = 0; index < 2; index++) {
      const partida = partidas[index];

      await this.liga.partida.adicionaParticipantesNaPartidaECadastraResultado(
        liga,
        partida,
        resultado[index],
      );
    }
  }

  async inicializaSemis({
    liga,
    partidas,
    ignorarPartidas,
  }: IInicializaFinais): Promise<SemisLigaRespostaDto> {
    if (!ignorarPartidas) {
      for (const partidasMd3 of chunk(partidas, 3)) {
        await this.jogaMd3(liga, partidasMd3);

        await sleep(700);
      }
    }

    const requisicao = inicializaSemiFinalDto(
      new Date(last(partidas)?.dataComeco ?? new Date()),
    );

    return request(this.server)
      .post(`/liga/${liga.id}/inicializa-semis`)
      .send(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
