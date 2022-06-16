import request = require('supertest');

import {
  CadastrarParticipantesPartidaDto,
  ListaPartidasDto,
  PartidaRespostaDto,
} from 'src/modules/partida/dto/partida.dto';
import { LigaIniciadaServer } from '../liga/fluxos/liga-iniciada.server';
import { AtletaServer } from '../pessoa/atleta/atleta.server';
import { DelegadoServer } from '../pessoa/delegado/delegado.server';
import { ArbitroServer } from '../pessoa/arbitro/arbitro.server';

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
