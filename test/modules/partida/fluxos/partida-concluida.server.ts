import { LigaRespostaDto } from 'src/modules/liga/dto/liga.dto';
import { CadastrarResultadoPartidaDto } from 'src/modules/partida/dto/partida-cadastro-resultado.dto';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import request = require('supertest');
import { PartidaServer } from '../partida.server';

export class PartidaConcluidaServer {
  readonly partida: PartidaServer;
  constructor(private readonly server: unknown) {
    this.partida = new PartidaServer(server);
  }

  async adicionaParticipantesNaPartidaECadastraResultado(
    liga: LigaRespostaDto,
    partida: PartidaRespostaDto,
    requisicao: CadastrarResultadoPartidaDto,
  ) {
    const { requisicao: registro } =
      await this.partida.criaRegistroDeParticipantesNaPartida(liga, partida);

    await this.partida.inicializaPartida(partida.id, registro);

    return {
      partida: await this.cadastraResultado(partida.id, requisicao),
      registro,
    };
  }

  async cadastraResultado(
    id: string,
    requisicao: CadastrarResultadoPartidaDto,
  ): Promise<PartidaRespostaDto> {
    return request(this.server)
      .post(`/partida/${id}/cadastra-resultado`)
      .send(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
