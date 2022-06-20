import { INestApplication } from '@nestjs/common';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { EscolhaDeDesistencia } from 'src/modules/partida/dto/partida.dto';
import { initTestingApp } from '../helpers';
import { PontuacaoServer } from './pontuacao.server';

// process.env.LOGGING = '1';

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

  it('/pontuacao (GET)', async () => {
    const { partidaInicializada, liga } =
      await server.partida.criaPartidaInicializada(
        EscolhaDeDesistencia.MANDANTE,
      );

    const resultado = await server.listaPontuacao(liga.id);

    expect(partidaInicializada.ganhadora).toBeTruthy();

    expect(resultado).toHaveLength(Liga.minimoDeEquipesNaLiga);
    expect(resultado[0].idEquipe).toEqual(
      partidaInicializada.ganhadora?.idEquipe,
    );
    expect(resultado[resultado.length - 1].pontuacao).toBeLessThan(0);
  });
});
