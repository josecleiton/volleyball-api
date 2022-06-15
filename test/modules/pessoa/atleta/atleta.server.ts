import request = require('supertest');

import {
  AtletaRespostaDto,
  AtualizaAtletaDto,
  CriaAtletaDto,
} from 'src/modules/pessoa/dto/atleta.dto';
import { EquipeServer } from 'test/modules/equipe/equipe.server';
import {
  criaAtletaDto,
  listaAtletasDto,
} from 'test/__MOCKS__/pessoa/atleta.mock';

export class AtletaServer {
  readonly equipeServer: EquipeServer;

  constructor(private readonly server: unknown) {
    this.equipeServer = new EquipeServer(this.server);
  }

  async criaAtletaComEquipe() {
    const resultado = await this.equipeServer.criaEquipeLigaEGinasio();
    const atleta = await this.criaAtleta(criaAtletaDto(resultado.equipe.id));

    return { ...resultado, atleta };
  }

  async criaAtleta(requisicao: CriaAtletaDto): Promise<AtletaRespostaDto> {
    return request(this.server)
      .post('/pessoa/atleta')
      .send(requisicao)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async encontraAtleta(id: string): Promise<AtletaRespostaDto> {
    return request(this.server)
      .get(`/pessoa/atleta/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async listaAtletas(idEquipe: string): Promise<AtletaRespostaDto[]> {
    return request(this.server)
      .get('/pessoa/atleta')
      .query(listaAtletasDto(idEquipe))
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async atualizaAtleta(
    id: string,
    requisicao: AtualizaAtletaDto,
  ): Promise<AtletaRespostaDto> {
    return request(this.server)
      .patch(`/pessoa/atleta/${id}`)
      .send(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async removeAtleta(id: string) {
    return request(this.server).delete(`/pessoa/atleta/${id}`).expect(200);
  }
}
