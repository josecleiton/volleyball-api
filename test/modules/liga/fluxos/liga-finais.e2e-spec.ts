import { INestApplication } from '@nestjs/common';
import { StatusLiga } from 'src/modules/liga/enums';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { initTestingApp } from 'test/modules/helpers';
import { LigaFinaisServer } from './liga-finais.server';

describe('Fluxo - LigaFinais (e2e)', () => {
  let app: INestApplication;
  let server: LigaFinaisServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new LigaFinaisServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Semis', () => {
    it('Ok', async () => {
      const resultado = await server.liga.criaLigaEmQuartas();

      const { liga, partidas } = await server.inicializaSemis(resultado);

      expect(liga.status).toEqual(StatusLiga.SEMIS);
      expect(partidas).toHaveLength(6);
      expect(
        partidas.every((x) => x.status === StatusPartida.AGENDADA),
      ).toBeTruthy();
    });
  });
});