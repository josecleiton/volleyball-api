import * as request from 'supertest';
import {
  CriaGinasioDto,
  GinasioRespostaDto,
  ListaGinasiosDto,
} from 'src/modules/ginasio/dto/ginasio.dto';
import {
  criaGinasioDto,
  listaGinasiosDto,
} from 'test/__MOCKS__/ginasio/ginasio.mock';

export class GinasioServer {
  constructor(private readonly server: unknown) {}

  async criaGinasio(requisicao?: CriaGinasioDto): Promise<GinasioRespostaDto> {
    return request(this.server)
      .post('/ginasio')
      .send(requisicao ?? criaGinasioDto())
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async listaGinasio(
    requisicao?: ListaGinasiosDto,
  ): Promise<GinasioRespostaDto[]> {
    return request(this.server)
      .get('/ginasio')
      .query(requisicao ?? listaGinasiosDto())
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async removeGinasio(id: string) {
    return request(this.server).delete(`/ginasio/${id}`).expect(200);
  }
}
