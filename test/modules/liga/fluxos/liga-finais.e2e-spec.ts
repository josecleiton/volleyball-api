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

    describe('Conflict', () => {
      it('Liga não está em quartas', async () => {
        const liga = await server.liga.liga.liga.criaLiga();

        await expect(
          server.inicializaSemis({
            liga,
            partidas: [],
            ignorarPartidas: true,
          }),
        ).rejects.toThrow('409');
      });

      it('Confrontos sem vencedor nas quartas', async () => {
        const { liga } = await server.liga.criaLigaEmQuartas();

        await expect(
          server.inicializaSemis({
            liga,
            partidas: [],
            ignorarPartidas: true,
          }),
        ).rejects.toThrow('409');
      });
    });
  });

  describe('Final', () => {
    it('Ok', async () => {
      const resultado = await server.criaLigaEmSemi();

      const { liga, partidas } = await server.inicializaFinal(resultado);

      expect(liga.status).toEqual(StatusLiga.FINAL);
      expect(partidas).toHaveLength(3);
      expect(
        partidas.every((x) => x.status === StatusPartida.AGENDADA),
      ).toBeTruthy();
    });
  });

  describe('Premiação da competição', () => {
    it('Ok', async () => {
      const resultado = await server.criaLigaFinal();

      const liga = await server.premia(resultado);

      expect(liga.status).toEqual(StatusLiga.PREMIACAO);
    });

    describe('Conflict', () => {
      it('Status errado da liga', async () => {
        const liga = await server.liga.liga.liga.criaLiga();

        await expect(
          server.premia({ liga, partidas: [], ignorarPartidas: true }),
        ).rejects.toThrow('409');
      });

      it('Confronto não disputado', async () => {
        const resultado = await server.criaLigaFinal();

        await expect(
          server.premia({ ...resultado, ignorarPartidas: true }),
        ).rejects.toThrow('409');
      });
    });
  });
});
