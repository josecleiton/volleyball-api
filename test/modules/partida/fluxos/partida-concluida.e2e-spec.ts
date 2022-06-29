import { INestApplication } from '@nestjs/common';
import { PontosPartida } from 'src/modules/partida/enums/pontos-partida.enum';
import { initTestingApp } from 'test/modules/helpers';
import { PartidaConcluidaServer } from './partida-concluida.server';

describe('Fluxo - PartidaResultado (e2e)', () => {
  let app: INestApplication;
  let server: PartidaConcluidaServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new PartidaConcluidaServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/partida/:id/cadastra-resultado (POST)', () => {
    describe('Ok', () => {
      it('Derrota feia (0-3)', async () => {
        const { partidaInicializada } =
          await server.partida.criaPartidaInicializada();

        const partida = await server.cadastraResultado(partidaInicializada.id, {
          setsMandante: [12, 13, 18],
          setsVisitante: [25, 25, 25],
        });

        expect(partida.ganhadora).toBeTruthy();
        expect(partida.idEquipeGanhador).toEqual(partida.idEquipeVisitante);
        expect(partida.ganhadora?.pontuacao).toEqual(
          PontosPartida.VITORIA_PERFEITA,
        );
        expect(partida.visitante?.pontuacao).toEqual(
          PontosPartida.VITORIA_PERFEITA,
        );
        expect(partida.mandante?.pontuacao).toEqual(PontosPartida.DERROTA_FEIA);
      });
    });
  });
});
