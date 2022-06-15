import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { initTestingApp } from 'test/modules/helpers/init-testingapp.helper';
import {
  criaDelegadoDto,
  listaDelegadoDto,
} from 'test/__MOCKS__/pessoa/delegado.mock';
import { DelegadoServer } from './delegado.server';

describe('DelegadoController (e2e)', () => {
  let app: INestApplication;
  let server: DelegadoServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new DelegadoServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/pessoa/delegado (POST)', async () => {
    const liga = await server.ligaServer.criaLiga();

    const requisicao = criaDelegadoDto(liga.id);

    const delegado = await server.criaDelegado(requisicao);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataNascimento, ...toMatch } = requisicao;

    expect(delegado).toEqual(expect.objectContaining(toMatch));
  });

  it('/pessoa/delegado (GET)', async () => {
    const { delegado: delegado1, liga } = await server.criaDelegadoComLiga();
    const delegado2 = await server.criaDelegado(criaDelegadoDto(liga.id));

    const delegados = await server.listaDelegado(listaDelegadoDto(liga.id));

    expect(delegados).toEqual(expect.arrayContaining([delegado2, delegado1]));
  });

  describe('/pessoa/delegado/:id (GET)', () => {
    it('Ok', async () => {
      const { delegado } = await server.criaDelegadoComLiga();

      const delegadoResposta = await server.encontraDelegado(delegado.id);

      expect(delegadoResposta).toEqual(expect.objectContaining(delegado));
    });

    it('Not Found', async () => {
      await expect(server.encontraDelegado(randomUUID())).rejects.toThrow(
        '404',
      );
    });
  });
});
