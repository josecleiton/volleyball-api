import 'reflect-metadata';

import faker = require('faker');

import { INestApplication } from '@nestjs/common';
import { initTestingApp } from '../helpers';
import { PartidaServer } from './partida.server';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { listaPartidasDto } from 'test/__MOCKS__/partidas/partida.mock';
import { EscolhaDeDesistencia } from 'src/modules/partida/dto/partida.dto';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { randomUUID } from 'crypto';

describe('PartidaController (e2e)', () => {
  let app: INestApplication;
  let server: PartidaServer;

  async function participacaoNaPartida() {
    const { liga, partidas } =
      await server.fluxoLigaIniciada.criaLigaInicializada();
    return server.criaRegistroDeParticipantesNaPartida(
      liga,
      faker.random.arrayElement(partidas),
    );
  }

  beforeEach(async () => {
    app = await initTestingApp();
    server = new PartidaServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/partida (GET)', async () => {
    const { liga } = await server.fluxoLigaIniciada.criaLigaInicializada();

    const partidas = await server.listarPartidas(listaPartidasDto(liga.id));

    expect(partidas).toHaveLength(
      Liga.quantidadeDePartidasEmRodadaClassificatoria,
    );
  });

  describe('/partida/:id (GET)', () => {
    it('Ok', async () => {
      const { partidas } =
        await server.fluxoLigaIniciada.criaLigaInicializada();

      const partida = faker.random.arrayElement(partidas);

      const partidaResposta = await server.encontraPartida(partida.id);

      expect(partidaResposta).toEqual(
        expect.objectContaining({
          id: partida.id,
          idEquipeMandante: partida.idEquipeMandante,
          idEquipeVisitante: partida.idEquipeVisitante,
          idEquipeGanhador: null,
          status: StatusPartida.AGENDADA,
        }),
      );
    });

    it('Not Found', async () => {
      await expect(server.encontraPartida(randomUUID())).rejects.toThrow('404');
    });
  });

  describe('/partida/cadastra-participantes (POST)', () => {
    it('Ok', async () => {
      const { partida, requisicao } = await participacaoNaPartida();
      await server.inicializaPartida(partida.id, requisicao);

      const partidaAtualizada = await server.encontraPartida(partida.id);

      expect(partidaAtualizada.id).toEqual(partida.id);
      expect(partidaAtualizada.status).toEqual(
        StatusPartida.PARTICIPANTES_CADASTRADOS,
      );
    });

    it('Ok - Desistencia', async () => {
      const { partida, requisicao } = await participacaoNaPartida();

      requisicao.desistente = EscolhaDeDesistencia.MANDANTE;

      await server.inicializaPartida(partida.id, requisicao);

      const partidaAtualizada = await server.encontraPartida(partida.id);

      expect(partidaAtualizada.id).toEqual(partida.id);
      expect(partidaAtualizada.status).toEqual(StatusPartida.WO);
      expect(partidaAtualizada.idEquipeGanhador).toEqual(
        partidaAtualizada.idEquipeVisitante,
      );
    });

    describe('BadRequest', () => {
      it('Falta árbitro principal', async () => {
        const { partida, requisicao } = await participacaoNaPartida();

        requisicao.arbitros = [];

        await expect(
          server.inicializaPartida(partida.id, requisicao),
        ).rejects.toThrow('400');
      });

      it('Falta o mínimo de atleta', async () => {
        const { partida, requisicao } = await participacaoNaPartida();

        requisicao.atletasMandante.shift();

        await expect(
          server.inicializaPartida(partida.id, requisicao),
        ).rejects.toThrow('400');
      });
    });

    describe('Not found', () => {
      it('Árbitro não encontrado', async () => {
        const { partida, requisicao } = await participacaoNaPartida();

        requisicao.arbitros[0].idArbitro = randomUUID();

        await expect(
          server.inicializaPartida(partida.id, requisicao),
        ).rejects.toThrow('404');
      });

      it('Atleta não encontrado', async () => {
        const { partida, requisicao } = await participacaoNaPartida();

        requisicao.atletasMandante[0].idAtleta = randomUUID();

        await expect(
          server.inicializaPartida(partida.id, requisicao),
        ).rejects.toThrow('404');
      });
    });
  });
});
