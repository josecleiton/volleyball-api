import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import { EquipeServer } from '../../equipe/equipe.server';
import { initTestingApp } from '../../helpers/init-testingapp.helper';

describe('LigaController - Com Equipe (e2e)', () => {
  let app: INestApplication;
  let server: EquipeServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new EquipeServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/liga/:id (DELETE)', async () => {
    const { liga, equipe } = await server.criaEquipeLigaEGinasio();

    await expect(server.encontraEquipe(equipe.id)).resolves.not.toThrow();

    await expect(server.liga.removeLiga(liga.id)).resolves.not.toThrow();

    await expect(server.liga.encontraLiga(liga.id)).rejects.toThrow('404');

    await expect(server.encontraEquipe(equipe.id)).rejects.toThrow('404');
  });
});
