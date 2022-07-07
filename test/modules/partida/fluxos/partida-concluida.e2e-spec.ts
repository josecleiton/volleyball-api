import faker = require('faker');
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
        expect(partida.dataFinalizacao).toBeTruthy();
        expect(partida.ganhadora?.pontuacao).toEqual(
          PontosPartida.VITORIA_PERFEITA,
        );
        expect(partida.visitante?.pontuacao).toEqual(
          PontosPartida.VITORIA_PERFEITA,
        );
        expect(partida.mandante?.pontuacao).toEqual(PontosPartida.DERROTA_FEIA);
      });

      it('Vitória perfeita (3-0)', async () => {
        const { partidaInicializada } =
          await server.partida.criaPartidaInicializada();

        const partida = await server.cadastraResultado(partidaInicializada.id, {
          setsVisitante: [12, 13, 18],
          setsMandante: [25, 25, 25],
        });

        expect(partida.ganhadora).toBeTruthy();
        expect(partida.idEquipeGanhador).toEqual(partida.idEquipeMandante);
        expect(partida.dataFinalizacao).toBeTruthy();
        expect(partida.ganhadora?.pontuacao).toEqual(
          PontosPartida.VITORIA_PERFEITA,
        );
        expect(partida.visitante?.pontuacao).toEqual(
          PontosPartida.DERROTA_FEIA,
        );
        expect(partida.mandante?.pontuacao).toEqual(
          PontosPartida.VITORIA_PERFEITA,
        );
      });

      it('Vitória simples (3-2)', async () => {
        const { partidaInicializada } =
          await server.partida.criaPartidaInicializada();

        const partida = await server.cadastraResultado(partidaInicializada.id, {
          setsMandante: [12, 13, 25, 25, 25],
          setsVisitante: [25, 25, 18, 20, 22],
        });

        expect(partida.ganhadora).toBeTruthy();
        expect(partida.idEquipeGanhador).toEqual(partida.idEquipeMandante);
        expect(partida.dataFinalizacao).toBeTruthy();
        expect(partida.ganhadora?.pontuacao).toEqual(
          PontosPartida.VITORIA_SIMPLES,
        );
        expect(partida.visitante?.pontuacao).toEqual(
          PontosPartida.DERROTA_SIMPLES,
        );
        expect(partida.mandante?.pontuacao).toEqual(
          PontosPartida.VITORIA_SIMPLES,
        );
      });

      it('Derrota simples (3-2)', async () => {
        const { partidaInicializada } =
          await server.partida.criaPartidaInicializada();

        const partida = await server.cadastraResultado(partidaInicializada.id, {
          setsMandante: [25, 25, 18, 20, 22],
          setsVisitante: [12, 13, 25, 25, 25],
        });

        expect(partida.ganhadora).toBeTruthy();
        expect(partida.idEquipeGanhador).toEqual(partida.idEquipeVisitante);
        expect(partida.dataFinalizacao).toBeTruthy();
        expect(partida.ganhadora?.pontuacao).toEqual(
          PontosPartida.VITORIA_SIMPLES,
        );
        expect(partida.visitante?.pontuacao).toEqual(
          PontosPartida.VITORIA_SIMPLES,
        );
        expect(partida.mandante?.pontuacao).toEqual(
          PontosPartida.DERROTA_SIMPLES,
        );
      });
    });

    describe('Unprocessable Entity', () => {
      it('Status não é participante cadastrado', async () => {
        const { partidas } =
          await server.partida.fluxoLigaIniciada.criaLigaInicializada();
        const partida = faker.random.arrayElement(partidas);

        await expect(
          server.cadastraResultado(partida.id, {
            setsMandante: [25, 25, 25],
            setsVisitante: [0, 0, 0],
          }),
        ).rejects.toThrow('422');
      });

      it('Cardinalidade dos sets não são iguais', async () => {
        const { partidaInicializada } =
          await server.partida.criaPartidaInicializada();

        await expect(
          server.cadastraResultado(partidaInicializada.id, {
            setsMandante: [25, 13, 18, 25],
            setsVisitante: [28, 25, 25],
          }),
        ).rejects.toThrow('422');
      });

      it('Diferença entre pontos no set não é 2 para sets com mais de 25 pontos', async () => {
        const { partidaInicializada } =
          await server.partida.criaPartidaInicializada();

        await expect(
          server.cadastraResultado(partidaInicializada.id, {
            setsMandante: [25, 13, 18],
            setsVisitante: [28, 25, 25],
          }),
        ).rejects.toThrow('422');

        const partida = await server.partida.encontraPartida(
          partidaInicializada.id,
        );
        expect(partida.ganhadora).toBeFalsy();
      });

      it('Uma equipe venceu mais do que o necessário em uma partida. Ex: 4-1', async () => {
        const { partidaInicializada } =
          await server.partida.criaPartidaInicializada();

        await expect(
          server.cadastraResultado(partidaInicializada.id, {
            setsMandante: [25, 13, 18, 10],
            setsVisitante: [28, 25, 25, 25],
          }),
        ).rejects.toThrow('422');

        const partida = await server.partida.encontraPartida(
          partidaInicializada.id,
        );
        expect(partida.ganhadora).toBeFalsy();
      });
    });
  });
});
