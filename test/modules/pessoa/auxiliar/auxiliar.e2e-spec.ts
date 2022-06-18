import faker = require('faker');
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { initTestingApp } from 'test/modules/helpers';
import { criaAuxiliarDto } from 'test/__MOCKS__/pessoa/auxiliar.mock';
import { AuxiliarServer } from './auxiliar.server';

describe('AuxiliarController (e2e)', () => {
  let app: INestApplication;
  let server: AuxiliarServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new AuxiliarServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/pessoa/auxiliar (POST)', async () => {
    const { equipe } = await server.equipeServer.criaEquipeLigaEGinasio();

    const requisicao = criaAuxiliarDto(equipe.id);

    const auxiliar = await server.criaAuxiliar(requisicao);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataNascimento, ...toMatch } = requisicao;

    expect(auxiliar).toEqual(expect.objectContaining(toMatch));
  });

  it('/pessoa/auxiliar (GET)', async () => {
    const { auxiliar: auxiliar1, equipe } =
      await server.criaAuxiliarComEquipe();
    const auxiliar2 = await server.criaAuxiliar(criaAuxiliarDto(equipe.id));

    const auxiliares = await server.listaAuxiliares(equipe.id);

    expect(auxiliares).toEqual(
      expect.arrayContaining(
        faker.random.arrayElements([auxiliar2, auxiliar1]),
      ),
    );
  });

  describe('/pessoa/auxiliar/:id (GET)', () => {
    it('Ok', async () => {
      const { auxiliar } = await server.criaAuxiliarComEquipe();

      const auxiliarResposta = await server.encontraAuxiliar(auxiliar.id);

      expect(auxiliarResposta).toEqual(expect.objectContaining(auxiliar));
    });

    it('Not Found', async () => {
      await expect(server.encontraAuxiliar(randomUUID())).rejects.toThrow(
        '404',
      );
    });
  });
});
