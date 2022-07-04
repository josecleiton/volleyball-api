import { INestApplication } from '@nestjs/common';
import { StatusLiga } from 'src/modules/liga/enums';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { initTestingApp } from 'test/modules/helpers';
import { LigaQuartasDeFinalServer } from './liga-quartas-de-final.server';

describe('LigaController - Com Equipe (e2e)', () => {
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
});
