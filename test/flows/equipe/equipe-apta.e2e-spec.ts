import { INestApplication } from '@nestjs/common';
import { initTestingApp } from 'test/modules/helpers';
import { EquipeAptaServer } from './equipe-apta.server';

describe('Flow - Equipe Apta', () => {
  let app: INestApplication;
  let server: EquipeAptaServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new EquipeAptaServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('Torna equipe apta', async () => {
    const { equipe } = await server.equipe.criaEquipeLigaEGinasio();

    await server.tornaEquipeApta(equipe);

    const equipeResposta = await server.equipe.encontraEquipe(equipe.id);

    expect(equipeResposta.apta).toBeTruthy();
  });
});
