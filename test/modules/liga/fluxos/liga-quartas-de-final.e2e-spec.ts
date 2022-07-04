import { INestApplication } from '@nestjs/common';
import { StatusLiga } from 'src/modules/liga/enums';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { initTestingApp } from 'test/modules/helpers';
import { LigaQuartasDeFinalServer } from './liga-quartas-de-final.server';

// process.env.LOGGING = '1';

describe('Fluxo - LigaQuartasDeFinal (e2e)', () => {
  let app: INestApplication;
  let server: LigaQuartasDeFinalServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new LigaQuartasDeFinalServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('Ok', async () => {
    const resultado = await server.liga.criaLigaInicializada();

    const { liga, partidas } = await server.inicializaQuartasDeFinal(resultado);

    expect(partidas).toHaveLength(12);
    expect(
      partidas.every((p) => p.status === StatusPartida.AGENDADA),
    ).toBeTruthy();
    expect(liga.status).toEqual(StatusLiga.QUARTAS);
  });

  describe('Conflict', () => {
    it('Liga não está em Classificação', async () => {
      const liga = await server.liga.liga.criaLiga();
      await expect(
        server.inicializaQuartasDeFinal({
          liga,
          partidas: [],
        }),
      ).rejects.toThrow('409');
    });

    it('Liga não teve todas as suas partidas jogadas', async () => {
      const resultado = await server.liga.criaLigaInicializada();

      await expect(
        server.inicializaQuartasDeFinal({
          ...resultado,
          ignorarPartidas: true,
        }),
      ).rejects.toThrow('409');
    });
  });
});
