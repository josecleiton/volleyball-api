import faker = require('faker');
import { INestApplication } from '@nestjs/common';
import { initTestingApp } from 'test/modules/helpers';
import { criaFundamentoAtleta } from 'test/__MOCKS__/estatistica/fundamento-atleta.mock';
import { FundamentoAtletaServer } from './fundamento-atleta.server';
import { randomUUID } from 'crypto';

describe('FundamentoAtletaController (e2e)', () => {
  let app: INestApplication;
  let server: FundamentoAtletaServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new FundamentoAtletaServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/estatistica/atleta (POST)', async () => {
    const { partidaInicializada: partida, registroPartida } =
      await server.partida.criaPartidaInicializada();

    const { idAtleta } = faker.random.arrayElement(
      registroPartida.atletasMandante,
    );

    const requisicao = criaFundamentoAtleta(
      partida.id,
      idAtleta,
      undefined,
      faker.datatype.number({ min: 1, max: 15 }),
    );
    const fundamento = await server.criaFundamentoAtleta(requisicao);

    expect(fundamento).toEqual(
      expect.objectContaining({
        recepcoes: requisicao.recepcoes,
      }),
    );
  });

  it('/estatistica/atleta/geral/:id (GET)', async () => {
    const fundamentos = await server.listaFundamentosAtleta(randomUUID());

    expect(fundamentos).toEqual(expect.any(Array));
  });

  describe('/estatistica/atleta (DELETE)', () => {
    it('Ok', async () => {
      const { fundamento, idAtleta } =
        await server.criaFundamentoAtletaBloqueio();

      await server.removeFundamentoAtleta(fundamento.id);

      const fundamentos = await server.listaFundamentosAtleta(idAtleta);

      expect(fundamentos).toHaveLength(0);
    });

    it('Not Found', async () => {
      await expect(server.removeFundamentoAtleta(randomUUID())).rejects.toThrow(
        '404',
      );
    });
  });
});
