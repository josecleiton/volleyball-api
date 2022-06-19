import request = require('supertest');

import {
  AtletaParticipacaoDto,
  CadastrarParticipantesPartidaDto,
  EscolhaDeDesistencia,
  ListaPartidasDto,
  PartidaRespostaDto,
} from 'src/modules/partida/dto/partida.dto';
import { LigaIniciadaServer } from '../liga/fluxos/liga-iniciada.server';
import { AtletaServer } from '../pessoa/atleta/atleta.server';
import { DelegadoServer } from '../pessoa/delegado/delegado.server';
import { ArbitroServer } from '../pessoa/arbitro/arbitro.server';
import faker = require('faker');
import { listaDelegadoDto } from 'test/__MOCKS__/pessoa/delegado.mock';
import { listaArbitroDto } from 'test/__MOCKS__/pessoa/arbitro.mock';
import { Posicao, TipoArbitro } from 'src/modules/pessoa/enums';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { LigaRespostaDto } from 'src/modules/liga/dto/liga.dto';

export class PartidaServer {
  readonly fluxoLigaIniciada: LigaIniciadaServer;
  readonly atleta: AtletaServer;
  readonly delegado: DelegadoServer;
  readonly arbitro: ArbitroServer;

  constructor(private readonly server: unknown) {
    this.fluxoLigaIniciada = new LigaIniciadaServer(this.server);
    this.atleta = new AtletaServer(this.server);
    this.delegado = new DelegadoServer(this.server);
    this.arbitro = new ArbitroServer(this.server);
  }

  async criaRegistroDeParticipantesNaPartida(
    liga: LigaRespostaDto,
    partida: PartidaRespostaDto,
  ) {
    const delegado = faker.random.arrayElement(
      await this.delegado.listaDelegado(listaDelegadoDto(liga.id)),
    );

    const arbitro = faker.random.arrayElement(
      await this.arbitro.listaArbitros(listaArbitroDto(liga.id)),
    );

    const atletasMandante = await this.atleta.listaAtletas(
      partida.mandante.equipe.id,
    );

    const atletasVisitante = await this.atleta.listaAtletas(
      partida.visitante.equipe.id,
    );

    const requisicao: CadastrarParticipantesPartidaDto = {
      arbitros: [{ idArbitro: arbitro.id, tipo: TipoArbitro.PRINCIPAL }],
      idDelegado: delegado.id,
      atletasMandante: atletasMandante.map(this.geraAtletaParticipacao),
      atletasVisitante: atletasVisitante.map(this.geraAtletaParticipacao),
    };

    return { partida, requisicao };
  }

  async criaPartidaInicializada(
    desistente?: EscolhaDeDesistencia,
    indexPartida = -1,
  ) {
    const { liga, partidas } =
      await this.fluxoLigaIniciada.criaLigaInicializada();

    const { partida, requisicao } =
      await this.criaRegistroDeParticipantesNaPartida(
        liga,
        partidas[indexPartida] ?? faker.random.arrayElement(partidas),
      );

    requisicao.desistente = desistente;

    return {
      partidaInicializada: await this.inicializaPartida(partida.id, requisicao),
      liga,
      partidas,
    };
  }

  private geraAtletaParticipacao(
    atleta: AtletaRespostaDto,
  ): AtletaParticipacaoDto {
    return {
      idAtleta: atleta.id,
      posicao: faker.random.arrayElement([
        Posicao.CENTRAL,
        Posicao.LEVANTADOR,
        Posicao.OPOSTO,
        Posicao.PONTA,
      ]),
    };
  }

  async listarPartidas(
    requisicao: ListaPartidasDto,
  ): Promise<PartidaRespostaDto[]> {
    return request(this.server)
      .get('/partida')
      .query(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async encontraPartida(id: string): Promise<PartidaRespostaDto> {
    return request(this.server)
      .get(`/partida/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async inicializaPartida(
    id: string,
    requisicao: CadastrarParticipantesPartidaDto,
  ): Promise<PartidaRespostaDto> {
    return request(this.server)
      .post(`/partida/${id}/cadastra-participantes`)
      .send(requisicao)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
