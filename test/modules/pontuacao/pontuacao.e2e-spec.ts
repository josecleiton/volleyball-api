import { INestApplication } from '@nestjs/common';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { EscolhaDeDesistencia } from 'src/modules/partida/dto/partida.dto';
import { initTestingApp } from '../helpers';
import { PontuacaoServer } from './pontuacao.server';

// process.env.LOGGING = '1';
// process.env.REAL_CONNECTION = '1';

describe('PontuacaoController (e2e)', () => {
  let app: INestApplication;
  let server: PontuacaoServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new PontuacaoServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/pontuacao (GET)', () => {
    it('1 equipe venceu a outra por desistência', async () => {
      const { partidaInicializada, liga } =
        await server.partida.criaPartidaInicializada(
          EscolhaDeDesistencia.MANDANTE,
        );

      const resultado = await server.listaPontuacao(liga.id);

      expect(partidaInicializada.ganhadora).toBeTruthy();

      expect(resultado).toHaveLength(Liga.quantidadeDeEquipesNaLiga);
      expect(resultado[0].idEquipe).toEqual(
        partidaInicializada.ganhadora?.idEquipe,
      );
      expect(resultado[resultado.length - 1].pontuacao).toBeLessThan(0);
    });

    describe('Desempate', () => {
      it('equipe A empata com a B por desistência. Desempate usa fator random', async () => {
        const { partidaInicializada, liga, partidas } =
          await server.partida.criaPartidaInicializada(
            EscolhaDeDesistencia.MANDANTE,
          );
        expect(partidaInicializada.ganhadora).toBeTruthy();

        let [outraPartida] = partidas.filter(
          (x) =>
            x.mandante.equipe.id === partidaInicializada.visitante.equipe.id &&
            x.visitante.equipe.id === partidaInicializada.mandante.equipe.id,
        );

        expect(outraPartida).toBeDefined();

        {
          const { requisicao: reqParticipacao } =
            await server.partida.criaRegistroDeParticipantesNaPartida(
              liga,
              outraPartida,
            );
          reqParticipacao.desistente = EscolhaDeDesistencia.MANDANTE;
          outraPartida = await server.partida.inicializaPartida(
            outraPartida.id,
            reqParticipacao,
          );
          expect(outraPartida.ganhadora).toBeTruthy();
        }

        const resultado = await server.listaPontuacao(liga.id);

        expect(resultado).toHaveLength(Liga.quantidadeDeEquipesNaLiga);

        expect(resultado.slice(0, 2)).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              idEquipe: partidaInicializada.ganhadora?.equipe.id,
            }),
            expect.objectContaining({
              idEquipe: outraPartida.ganhadora?.equipe.id,
            }),
          ]),
        );
      });
    });
  });
});
