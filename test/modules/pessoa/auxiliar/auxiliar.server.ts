import request = require('supertest');

import {
  AuxiliarRespostaDto,
  CriaAuxiliarDto,
} from 'src/modules/pessoa/dto/auxiliar.dto';
import { EquipeServer } from 'test/modules/equipe/equipe.server';
import {
  criaAuxiliarDto,
  listaAuxiliarDto,
} from 'test/__MOCKS__/pessoa/auxiliar.mock';

export class AuxiliarServer {
  readonly equipeServer: EquipeServer;

  constructor(private readonly server: unknown) {
    this.equipeServer = new EquipeServer(this.server);
  }

  async criaAuxiliarComEquipe() {
    const resultado = await this.equipeServer.criaEquipeLigaEGinasio();
    const auxiliar = await this.criaAuxiliar(
      criaAuxiliarDto(resultado.equipe.id),
    );

    return { ...resultado, auxiliar };
  }

  async criaAuxiliar(
    requisicao: CriaAuxiliarDto,
  ): Promise<AuxiliarRespostaDto> {
    return request(this.server)
      .post('/pessoa/auxiliar')
      .send(requisicao)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async encontraAuxiliar(id: string): Promise<AuxiliarRespostaDto> {
    return request(this.server)
      .get(`/pessoa/auxiliar/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async listaAuxiliares(idEquipe: string): Promise<AuxiliarRespostaDto[]> {
    return request(this.server)
      .get('/pessoa/auxiliar')
      .query(listaAuxiliarDto(idEquipe))
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
