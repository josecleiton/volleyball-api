import request = require('supertest');

import {
  CriaDelegadoDto,
  DelegadoRespostaDto,
  ListaDelegadoDto,
} from 'src/modules/pessoa/dto/delegado.dto';
import { LigaServer } from 'test/modules/liga/liga.server';
import { criaDelegadoDto } from 'test/__MOCKS__/pessoa/delegado.mock';

export class DelegadoServer {
  readonly ligaServer: LigaServer;

  constructor(private readonly server: unknown) {
    this.ligaServer = new LigaServer(this.server);
  }

  async criaDelegadoComLiga() {
    const liga = await this.ligaServer.criaLiga();

    return {
      liga,
      delegado: await this.criaDelegado(criaDelegadoDto(liga.id)),
    };
  }

  async criaDelegado(
    requisicao: CriaDelegadoDto,
  ): Promise<DelegadoRespostaDto> {
    return request(this.server)
      .post('/pessoa/delegado')
      .send(requisicao)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async encontraDelegado(id: string): Promise<DelegadoRespostaDto> {
    return request(this.server)
      .get(`/pessoa/delegado/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async listaDelegado(
    requisicao: ListaDelegadoDto,
  ): Promise<DelegadoRespostaDto[]> {
    return request(this.server)
      .get('/pessoa/delegado')
      .query(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
