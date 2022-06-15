import { INestApplication } from '@nestjs/common';
import { initTestingApp } from 'test/modules/helpers';
import {
  criaArbitroDto,
  listaArbitroDto,
} from 'test/__MOCKS__/pessoa/arbitro.mock';
import { ArbitroServer } from './arbitro.server';

describe('ArbitroController (e2e)', () => {
  let app: INestApplication;
  let server: ArbitroServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new ArbitroServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/pessoa/arbitro (POST)', async () => {
    const liga = await server.liga.criaLiga();

    const requisicao = criaArbitroDto(liga.id);

    const arbitro = await server.criaArbitro(requisicao);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataNascimento, ...toMatch } = requisicao;

    expect(arbitro).toEqual(expect.objectContaining(toMatch));
  });

  it('/pessoa/arbitro (GET)', async () => {
    const { arbitro: arbitro1, liga } = await server.criaArbitroComLiga();
    const arbitro2 = await server.criaArbitro(criaArbitroDto(liga.id));

    const arbitros = await server.listaArbitros(listaArbitroDto(liga.id));

    expect(arbitros).toEqual(expect.arrayContaining([arbitro2, arbitro1]));
  });
});
