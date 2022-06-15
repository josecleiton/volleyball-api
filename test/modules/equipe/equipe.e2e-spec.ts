import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import faker = require('faker');
import {
  atualizaEquipeDto,
  criaEquipeDto,
  listaEquipesDto,
} from 'test/__MOCKS__/equipe/equipe.mock';
import { initTestingApp } from '../helpers/init-testingapp.helper';
import { EquipeServer } from './equipe.server';

describe('EquipeController (e2e)', () => {
  let app: INestApplication;
  let server: EquipeServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new EquipeServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/equipe (POST)', async () => {
    const liga = await server.liga.criaLiga();
    const ginasio = await server.ginasio.criaGinasio();
    const requisicao = criaEquipeDto(liga.id, ginasio.id);

    const equipe = await server.criaEquipe(liga, ginasio, requisicao);

    expect(equipe).toEqual(expect.objectContaining(requisicao));
  });

  it('/equipe (GET)', async () => {
    const { liga, equipe } = await server.criaEquipeLigaEGinasio();

    const requisicao = listaEquipesDto(liga.id);

    const listaEquipe = await server.listaEquipe(requisicao);

    expect(listaEquipe).toEqual(expect.arrayContaining([equipe]));
  });

  describe('/equipe/:id (GET)', () => {
    it('Ok', async () => {
      const { equipe } = await server.criaEquipeLigaEGinasio();

      const equipeResposta = await server.encontraEquipe(equipe.id);

      expect(equipeResposta).toEqual(expect.objectContaining(equipe));
    });

    it('Not Found', async () => {
      await expect(server.encontraEquipe(randomUUID())).rejects.toThrow('404');
    });
  });

  describe('/equipe/:id (PATCH)', () => {
    it('Ok', async () => {
      const { equipe } = await server.criaEquipeLigaEGinasio();

      const requisicao = atualizaEquipeDto(undefined, true);
      const equipeResposta = await server.atualizaEquipe(equipe.id, requisicao);

      expect(equipeResposta).toEqual(
        expect.objectContaining({ ...equipe, nome: requisicao.nome }),
      );
    });

    it('Ok com brasão', async () => {
      const { equipe } = await server.criaEquipeLigaEGinasio();

      const requisicao = atualizaEquipeDto(
        undefined,
        false,
        false,
        false,
        true,
      );
      const equipeResposta = await server.atualizaEquipe(equipe.id, requisicao);

      expect(equipeResposta).toEqual(
        expect.objectContaining({ ...equipe, urlBrasao: requisicao.urlBrasao }),
      );
    });

    it('Conflict porque o brasão não é uma imagem', async () => {
      const { equipe } = await server.criaEquipeLigaEGinasio();

      const requisicao = atualizaEquipeDto(undefined, true);
      requisicao.urlBrasao = faker.internet.url();

      await expect(
        server.atualizaEquipe(equipe.id, requisicao),
      ).rejects.toThrow('409');
    });

    it('Not Found', async () => {
      await expect(
        server.atualizaEquipe(randomUUID(), atualizaEquipeDto(undefined, true)),
      ).rejects.toThrow('404');
    });
  });

  describe('/equipe/:id (DELETE)', () => {
    it('Ok', async () => {
      const { equipe } = await server.criaEquipeLigaEGinasio();

      await server.removeEquipe(equipe.id);

      await expect(server.encontraEquipe(equipe.id)).rejects.toThrow('404');
    });

    it('Not Found', async () => {
      await expect(server.removeEquipe(randomUUID())).rejects.toThrow('404');
    });
  });
});
