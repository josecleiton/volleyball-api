import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { criaLigaDto } from 'test/__MOCKS__/liga/liga.mock';
import { initTestingApp } from '../helpers/init-testingapp.helper';
import { LigaServer } from './liga.server';

describe('LigaController (e2e)', () => {
  let app: INestApplication;
  let server: LigaServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new LigaServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/liga (POST)', async () => {
    const body = criaLigaDto();
    const liga = await server.criaLiga(body);

    expect(liga).toEqual(expect.objectContaining(body));
  });

  it('/liga (GET)', async () => {
    const ligas = await server.listaLigas();

    expect(ligas).toEqual(expect.any(Array));
  });

  describe('/liga/:id (GET)', () => {
    it('Ok', async () => {
      const ligaCriada = await server.criaLiga();
      const ligaResposta = await server.encontraLiga(ligaCriada.id);

      expect(ligaResposta).toEqual(expect.objectContaining(ligaCriada));
    });

    it('Not Found', async () => {
      await expect(server.encontraLiga(randomUUID())).rejects.toThrow('404');
    });
  });

  describe('/liga/:id (DELETE)', () => {
    it('OK', async () => {
      const ligaCriada = await server.criaLiga();
      await server.removeLiga(ligaCriada.id);

      await expect(server.encontraLiga(ligaCriada.id)).rejects.toThrow('404');
    });

    it('Not Found', async () => {
      await expect(server.removeLiga(randomUUID())).rejects.toThrow('404');
    });
  });
});
