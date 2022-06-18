import { CriaLigaDto, LigaRespostaDto } from 'src/modules/liga/dto/liga.dto';
import * as request from 'supertest';
import { criaLigaDto } from 'test/__MOCKS__/liga/liga.mock';

export class LigaServer {
  constructor(private readonly server: unknown) {}

  async criaLiga(body?: CriaLigaDto): Promise<LigaRespostaDto> {
    return request(this.server)
      .post('/liga')
      .send(body ?? criaLigaDto())
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async listaLigas(): Promise<LigaRespostaDto[]> {
    return request(this.server)
      .get('/liga')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async encontraLiga(id: string): Promise<LigaRespostaDto> {
    return request(this.server)
      .get(`/liga/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async removeLiga(id: string) {
    return request(this.server).delete(`/liga/${id}`).expect(200);
  }
}
