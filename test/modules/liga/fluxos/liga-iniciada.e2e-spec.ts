import { INestApplication } from '@nestjs/common';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { StatusLiga } from 'src/modules/liga/enums/status-liga.enum';
import { initTestingApp } from 'test/modules/helpers';
import { LigaIniciadaServer } from './liga-iniciada.server';

describe('Fluxo - Liga iniciada', () => {
  let app: INestApplication;
  let server: LigaIniciadaServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new LigaIniciadaServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/liga/:id/iniciada (POST)', async () => {
    const liga = await server.liga.criaLiga();

    const { liga: ligaAtualizada, partidas } = await server.inicializaLiga(
      liga,
    );

    expect(partidas).toHaveLength(
      Liga.quantidadeDeEquipesNaLiga * (Liga.quantidadeDeEquipesNaLiga - 1),
    );
    expect(liga.id).toEqual(ligaAtualizada.id);
    expect(ligaAtualizada.dataComeco).toBeDefined();
    expect(ligaAtualizada.status).toEqual(StatusLiga.CLASSIFICATORIA);
  });
});
