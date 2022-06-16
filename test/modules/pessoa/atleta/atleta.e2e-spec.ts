import faker = require('faker');
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { initTestingApp } from 'test/modules/helpers/init-testingapp.helper';
import {
  atualizaAtletaDto,
  criaAtletaDto,
} from 'test/__MOCKS__/pessoa/atleta.mock';
import { AtletaServer } from './atleta.server';

describe('AtletaController (e2e)', () => {
  let app: INestApplication;
  let server: AtletaServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new AtletaServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/pessoa/atleta (POST)', async () => {
    const { equipe } = await server.equipe.criaEquipeLigaEGinasio();

    const requisicao = criaAtletaDto(equipe.id);

    const atleta = await server.criaAtleta(requisicao);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataNascimento, ...toMatch } = requisicao;

    expect(atleta).toEqual(expect.objectContaining(toMatch));
  });

  describe('/pessoa/atleta/:id (GET)', () => {
    it('Ok', async () => {
      const { atleta } = await server.criaAtletaComEquipe();

      const atletaResposta = await server.encontraAtleta(atleta.id);

      expect(atletaResposta).toEqual(expect.objectContaining(atleta));
    });

    it('Not Found', async () => {
      await expect(server.encontraAtleta(randomUUID())).rejects.toThrow('404');
    });
  });

  it('/pessoa/atleta (GET)', async () => {
    const { equipe, atleta: atleta1 } = await server.criaAtletaComEquipe();
    const atleta2 = await server.criaAtleta(criaAtletaDto(equipe.id));

    const atletas = await server.listaAtletas(equipe.id);

    expect(atletas).toEqual(
      expect.arrayContaining(faker.random.arrayElements([atleta2, atleta1])),
    );
    expect(atletas.every((x) => x.idEquipe === equipe.id)).toBeTruthy();
  });

  describe('/pessoa/atleta/:id (PATCH)', () => {
    it('Ok', async () => {
      const {
        atleta: { id },
      } = await server.criaAtletaComEquipe();

      const atletaAtualizado = await server.atualizaAtleta(
        id,
        atualizaAtletaDto(true),
      );

      const atleta = await server.encontraAtleta(id);

      expect(atletaAtualizado).toEqual(
        expect.objectContaining({ ...atleta, numero: atletaAtualizado.numero }),
      );
    });

    it('Not Found', async () => {
      await expect(server.encontraAtleta(randomUUID())).rejects.toThrow('404');
    });
  });

  describe('/pessoa/atleta/:id (DELETE)', () => {
    it('Ok', async () => {
      const {
        atleta: { id },
      } = await server.criaAtletaComEquipe();

      await server.encontraAtleta(id);

      await server.removeAtleta(id);

      await expect(server.encontraAtleta(id)).rejects.toThrow('404');
    });

    it('Not Found', async () => {
      await expect(server.removeAtleta(randomUUID())).rejects.toThrow('404');
    });
  });
});
