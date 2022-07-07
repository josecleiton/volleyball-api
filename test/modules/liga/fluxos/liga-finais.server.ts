/* eslint-disable no-await-in-loop */
import request = require('supertest');
import { chunk, last } from 'lodash';

import { sleep } from 'src/modules/core/utils';
import {
  FinalLigaRespostaDto,
  LigaRespostaDto,
  SemisLigaRespostaDto,
} from 'src/modules/liga/dto/liga.dto';
import {
  inicializaFinalDto,
  inicializaSemiFinalDto,
} from 'test/__MOCKS__/liga/tabela.dto';
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

  private async jogaTodasMd3(
    liga: LigaRespostaDto,
    partidas: PartidaRespostaDto[],
  ) {
    for (const partidasMd3 of chunk(partidas, 3)) {
      await this.jogaMd3(liga, partidasMd3);

      await sleep(50);
    }
  }

  async criaLigaFinal() {
    const resultado = await this.criaLigaEmSemi();

    return this.inicializaFinal(resultado);
  }

  async criaLigaEmSemi() {
    const resultado = await this.liga.criaLigaEmQuartas();

    return this.inicializaSemis(resultado);
  }

  async inicializaSemis({
    liga,
    partidas,
    ignorarPartidas,
  }: IInicializaFinais): Promise<SemisLigaRespostaDto> {
    if (!ignorarPartidas) {
      await this.jogaTodasMd3(liga, partidas);
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

  async inicializaFinal({
    liga,
    partidas,
    ignorarPartidas,
  }: IInicializaFinais): Promise<FinalLigaRespostaDto> {
    if (!ignorarPartidas) {
      await this.jogaTodasMd3(liga, partidas);
    }

    const requisicao = inicializaFinalDto(
      new Date(last(partidas)?.dataComeco ?? new Date()),
    );

    return request(this.server)
      .post(`/liga/${liga.id}/inicializa-final`)
      .send(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async premia({
    liga,
    partidas,
    ignorarPartidas,
  }: IInicializaFinais): Promise<LigaRespostaDto> {
    if (!ignorarPartidas) {
      await this.jogaMd3(liga, partidas);
    }

    return request(this.server)
      .patch(`/liga/${liga.id}/premiacao`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
