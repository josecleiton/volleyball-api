import 'reflect-metadata';

import faker = require('faker');

import { INestApplication } from '@nestjs/common';
import { initTestingApp } from '../helpers';
import { PartidaServer } from './partida.server';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { listaPartidasDto } from 'test/__MOCKS__/partidas/partida.mock';
import {
  EscolhaDeDesistencia,
  RemarcarPartidaDto,
} from 'src/modules/partida/dto/partida.dto';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { randomUUID } from 'crypto';
import { addDays, subMinutes } from 'date-fns';
import { Posicao } from 'src/modules/pessoa/enums';

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

  describe('/partida/:id/remarcar (PATCH)', () => {
    let requisicao: RemarcarPartidaDto;
    beforeEach(() => {
      requisicao = new RemarcarPartidaDto();
      requisicao.data = new Date();
    });

    it('Ok', async () => {
      const { liga, partidas } =
        await server.fluxoLigaIniciada.criaLigaInicializada();

      const partida = faker.random.arrayElement(partidas);

      requisicao.data = faker.date.between(
        liga.dataComeco ?? new Date(),
        addDays(new Date(), 1),
      );

      const partidaEncontrada = await server.encontraPartida(partida.id);

      const partidaAtualizada = await server.remarcarPartida(
        partida.id,
        requisicao,
      );

      expect(partidaAtualizada).toEqual(
        expect.objectContaining({
          ...partidaEncontrada,
          dataComeco: requisicao.data.toISOString(),
        }),
      );
    });

    describe('Conflict', () => {
      it('Data de remarcação menor que início da liga', async () => {
        const { liga, partidas } =
          await server.fluxoLigaIniciada.criaLigaInicializada();
        const partida = faker.random.arrayElement(partidas);

        requisicao.data = subMinutes(new Date(liga.dataComeco as Date), 1);

        await expect(
          server.remarcarPartida(partida.id, requisicao),
        ).rejects.toThrow('409');
      });

      it('Partida já finalizada', async () => {
        const { partida, requisicao: reqInicializaPartida } =
          await participacaoNaPartida();

        reqInicializaPartida.desistente = EscolhaDeDesistencia.MANDANTE;

        await server.inicializaPartida(partida.id, reqInicializaPartida);

        const partidaEncontrada = await server.encontraPartida(partida.id);

        expect(partidaEncontrada.finalizada).toBeTruthy();
        await expect(
          server.remarcarPartida(partida.id, requisicao),
        ).rejects.toThrow('409');
      });
    });
  });

  describe('/partida/:id/cadastra-participantes (POST)', () => {
    describe('Ok', () => {
      it('12 atletas escalados sem líbero', async () => {
        const { partida, requisicao } = await participacaoNaPartida();
        await server.inicializaPartida(partida.id, requisicao);

        const partidaAtualizada = await server.encontraPartida(partida.id);

        expect(partidaAtualizada.id).toEqual(partida.id);
        expect(partidaAtualizada.status).toEqual(
          StatusPartida.PARTICIPANTES_CADASTRADOS,
        );
      });

      describe('12 atletas escalados com líbero', () => {
        it('1 líbero', async () => {
          const { partida, requisicao } = await participacaoNaPartida();
          requisicao.atletasMandante[0].posicao = Posicao.LIBERO;

          await server.inicializaPartida(partida.id, requisicao);

          const partidaAtualizada = await server.encontraPartida(partida.id);

          expect(partidaAtualizada.id).toEqual(partida.id);
          expect(partidaAtualizada.status).toEqual(
            StatusPartida.PARTICIPANTES_CADASTRADOS,
          );
        });
        it('2 líberos', async () => {
          const { partida, requisicao } = await participacaoNaPartida();
          requisicao.atletasMandante[0].posicao = Posicao.LIBERO;
          requisicao.atletasMandante[1].posicao = Posicao.LIBERO;

          await server.inicializaPartida(partida.id, requisicao);

          const partidaAtualizada = await server.encontraPartida(partida.id);

          expect(partidaAtualizada.id).toEqual(partida.id);
          expect(partidaAtualizada.status).toEqual(
            StatusPartida.PARTICIPANTES_CADASTRADOS,
          );
        });
      });

      it('Desistencia', async () => {
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
