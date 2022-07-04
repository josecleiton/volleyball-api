/* eslint-disable no-await-in-loop */
import pLimit = require('p-limit');
import request = require('supertest');
import { last } from 'lodash';

import {
  InicializaLigaRespostaDto,
  QuartasLigaRespostaDto,
} from 'src/modules/liga/dto/liga.dto';
import { PartidaConcluidaServer } from 'test/modules/partida/fluxos/partida-concluida.server';
import { inicializaQuartaDeFinalDto } from 'test/__MOCKS__/liga/tabela.dto';
import { cadastrarResultadoPartidaDto } from 'test/__MOCKS__/partidas/partida.mock';
import { LigaIniciadaServer } from './liga-iniciada.server';
import { sleep } from 'src/modules/core/utils';

export class LigaQuartasDeFinalServer {
  readonly liga: LigaIniciadaServer;
  readonly partida: PartidaConcluidaServer;

  constructor(private readonly server: unknown) {
    this.liga = new LigaIniciadaServer(server);
    this.partida = new PartidaConcluidaServer(server);
  }

  async inicializaQuartasDeFinal({
    liga,
    partidas,
  }: InicializaLigaRespostaDto): Promise<QuartasLigaRespostaDto> {
    for (const partida of partidas) {
      await this.partida.adicionaParticipantesNaPartidaECadastraResultado(
        liga,
        partida,
        cadastrarResultadoPartidaDto(),
      );

      await sleep(700);
    }

    return request(this.server)
      .post(`/liga/${liga.id}/inicializa-quartas`)
      .send(
        inicializaQuartaDeFinalDto(
          new Date(last(partidas)?.dataComeco as Date),
        ),
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
