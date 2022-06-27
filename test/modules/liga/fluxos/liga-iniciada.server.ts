import pLimit = require('p-limit');
import request = require('supertest');
import {
  InicializaLigaRespostaDto,
  LigaRespostaDto,
} from 'src/modules/liga/dto/liga.dto';
import { Liga } from 'src/modules/liga/entities/liga.entity';
import { EquipeAptaServer } from 'test/modules/equipe/fluxos/equipe-apta.server';
import { ArbitroServer } from 'test/modules/pessoa/arbitro/arbitro.server';
import { DelegadoServer } from 'test/modules/pessoa/delegado/delegado.server';
import { criaArbitroDto } from 'test/__MOCKS__/pessoa/arbitro.mock';
import { criaDelegadoDto } from 'test/__MOCKS__/pessoa/delegado.mock';
import { LigaServer } from '../liga.server';
import { inicializaLigaDto } from 'test/__MOCKS__/liga/liga.mock';

export class LigaIniciadaServer {
  readonly liga: LigaServer;
  private readonly equipeAptaServer: EquipeAptaServer;
  private readonly delegado: DelegadoServer;
  private readonly arbitro: ArbitroServer;

  constructor(private readonly server: unknown) {
    this.liga = new LigaServer(server);
    this.equipeAptaServer = new EquipeAptaServer(server);
    this.delegado = new DelegadoServer(server);
    this.arbitro = new ArbitroServer(server);
  }

  async criaLigaInicializada() {
    const liga = await this.liga.criaLiga();

    return this.inicializaLiga(liga);
  }

  async inicializaLiga(
    liga: LigaRespostaDto,
  ): Promise<InicializaLigaRespostaDto> {
    const limit = pLimit(1);

    const reqs: Promise<unknown>[] = [];

    for (let index = 0; index < Liga.quantidadeDeEquipesNaLiga; index++) {
      reqs.push(limit(() => this.equipeAptaServer.criaEquipeApta(liga)));
    }

    for (let index = 0; index < 6; index++) {
      reqs.push(
        limit(() => this.delegado.criaDelegado(criaDelegadoDto(liga.id))),
      );
    }

    for (let index = 0; index < 24; index++) {
      reqs.push(limit(() => this.arbitro.criaArbitro(criaArbitroDto(liga.id))));
    }

    await Promise.all(reqs);

    return request(this.server)
      .post(`/liga/${liga.id}/inicializa`)
      .send(inicializaLigaDto({}))
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
