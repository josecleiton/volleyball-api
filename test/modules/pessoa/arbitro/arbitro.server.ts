import request = require('supertest');

import {
  ArbitroRespostaDto,
  CriaArbitroDto,
  ListaArbitroDto,
} from 'src/modules/pessoa/dto/arbitro.dto';
import { LigaServer } from 'test/modules/liga/liga.server';
import { criaArbitroDto } from 'test/__MOCKS__/pessoa/arbitro.mock';

export class ArbitroServer {
  readonly liga: LigaServer;

  constructor(private readonly server: unknown) {
    this.liga = new LigaServer(this.server);
  }

  async criaArbitroComLiga() {
    const liga = await this.liga.criaLiga();

    return {
      liga,
      arbitro: await this.criaArbitro(criaArbitroDto(liga.id)),
    };
  }

  async criaArbitro(requisicao: CriaArbitroDto): Promise<ArbitroRespostaDto> {
    return request(this.server)
      .post('/pessoa/arbitro')
      .send(requisicao)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async listaArbitros(
    requisicao: ListaArbitroDto,
  ): Promise<ArbitroRespostaDto[]> {
    return request(this.server)
      .get('/pessoa/arbitro')
      .query(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
