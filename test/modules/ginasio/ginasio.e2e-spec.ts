import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { criaGinasioDto } from 'test/__MOCKS__/ginasio/ginasio.mock';
import { initTestingApp } from '../helpers/init-testingapp.helper';
import { GinasioServer } from './ginasio.server';

describe('GinasioController (e2e)', () => {
  let app: INestApplication;
  let server: GinasioServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new GinasioServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ginasio (POST)', async () => {
    const requisicao = criaGinasioDto();
    const ginasio = await server.criaGinasio(requisicao);

    expect(ginasio).toEqual(expect.objectContaining(requisicao));
  });

  describe('/ginasio (GET)', () => {
    it('Ok - Com Ginasio existente', async () => {
      const ginasio = await server.criaGinasio();

      const ligaGinasio = await server.listaGinasio(ginasio);

      expect(ligaGinasio).toEqual(expect.arrayContaining(ligaGinasio));
    });

    it('Ok - Com dados gerados', async () => {
      const ginasios = await server.listaGinasio();
      expect(ginasios).toEqual(expect.any(Array));
    });
  });

  describe('/ginasio/:id (DELETE)', () => {
    it('Ok', async () => {
      const ginasio = await server.criaGinasio();

      await server.removeGinasio(ginasio.id);

      const listaGinasio = await server.listaGinasio(ginasio);

      expect(listaGinasio).toHaveLength(0);
    });

    it('Not Found', async () => {
      await expect(server.removeGinasio(randomUUID())).rejects.toThrow('404');
    });
  });
});
