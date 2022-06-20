import { PontuacaoRespostaDto } from 'src/modules/pontuacao/dtos/pontuacao.dto';
import request = require('supertest');
import { PartidaServer } from '../partida/partida.server';

export class PontuacaoServer {
  readonly partida: PartidaServer;
  constructor(private readonly server: unknown) {
    this.partida = new PartidaServer(this.server);
  }

  async listaPontuacao(idLiga: string): Promise<PontuacaoRespostaDto[]> {
    return request(this.server)
      .get('/pontuacao')
      .query({ idLiga })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
