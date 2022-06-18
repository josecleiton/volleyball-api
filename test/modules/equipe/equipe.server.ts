import request = require('supertest');
import {
  AtualizaEquipeDto,
  CriaEquipeDto,
  EquipeRespostaDto,
  ListaEquipesDto,
} from 'src/modules/equipe/dto/equipe.dto';
import { GinasioRespostaDto } from 'src/modules/ginasio/dto/ginasio.dto';
import { LigaRespostaDto } from 'src/modules/liga/dto/liga.dto';
import { GinasioServer } from '../ginasio/ginasio.server';
import { LigaServer } from '../liga/liga.server';
import { criaEquipeDto } from 'test/__MOCKS__/equipe/equipe.mock';

export class EquipeServer {
  readonly liga: LigaServer;
  readonly ginasio: GinasioServer;
  constructor(private readonly server: unknown) {
    this.liga = new LigaServer(this.server);
    this.ginasio = new GinasioServer(this.server);
  }

  async criaEquipeLigaEGinasio() {
    const liga = await this.liga.criaLiga();
    const ginasio = await this.ginasio.criaGinasio();

    return { liga, ginasio, equipe: await this.criaEquipe(liga, ginasio) };
  }

  async criaEquipe(
    liga: LigaRespostaDto,
    ginasio: GinasioRespostaDto,
    requisicao?: Partial<CriaEquipeDto>,
  ): Promise<EquipeRespostaDto> {
    return request(this.server)
      .post('/equipe')
      .send(
        criaEquipeDto(
          liga.id,
          ginasio.id,
          requisicao?.nome,
          requisicao?.cidade,
          requisicao?.estado,
        ),
      )
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async listaEquipe(requisicao: ListaEquipesDto): Promise<EquipeRespostaDto[]> {
    return request(this.server)
      .get('/equipe')
      .query(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async encontraEquipe(id: string): Promise<EquipeRespostaDto> {
    return request(this.server)
      .get(`/equipe/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async atualizaEquipe(
    id: string,
    requisicao: AtualizaEquipeDto,
  ): Promise<EquipeRespostaDto> {
    return request(this.server)
      .patch(`/equipe/${id}`)
      .send(requisicao)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async removeEquipe(id: string) {
    return request(this.server).delete(`/equipe/${id}`).expect(200);
  }
}
