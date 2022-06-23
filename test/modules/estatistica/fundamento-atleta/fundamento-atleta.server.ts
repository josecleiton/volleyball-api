import request = require('supertest');

import {
  CriaFundamentoAtletaDto,
  FundamentoAtletaRespostaDto,
} from 'src/modules/estatistica/dto/fundamento-atleta.dto';
import { PartidaServer } from 'test/modules/partida/partida.server';
import faker = require('faker');
import { criaFundamentoAtleta } from 'test/__MOCKS__/estatistica/fundamento-atleta.mock';

export class FundamentoAtletaServer {
  readonly partida: PartidaServer;
  constructor(private readonly server: unknown) {
    this.partida = new PartidaServer(this.server);
  }

  async criaFundamentoAtletaBloqueio() {
    const { partidaInicializada: partida, registroPartida } =
      await this.partida.criaPartidaInicializada();

    const { idAtleta } = faker.random.arrayElement(
      registroPartida.atletasMandante,
    );

    const requisicao = criaFundamentoAtleta(
      partida.id,
      idAtleta,
      faker.datatype.number({ min: 1, max: 15 }),
    );

    return {
      fundamento: await this.criaFundamentoAtleta(requisicao),
      idAtleta,
    };
  }

  async criaFundamentoAtleta(
    requisicao: CriaFundamentoAtletaDto,
  ): Promise<FundamentoAtletaRespostaDto> {
    return request(this.server)
      .post('/estatistica/atleta')
      .send(requisicao)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async removeFundamentoAtleta(id: string) {
    return request(this.server).delete(`/estatistica/atleta/${id}`).expect(200);
  }

  async listaFundamentosAtleta(
    idAtleta: string,
  ): Promise<FundamentoAtletaRespostaDto[]> {
    return request(this.server)
      .get(`/estatistica/atleta/geral/${idAtleta}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
