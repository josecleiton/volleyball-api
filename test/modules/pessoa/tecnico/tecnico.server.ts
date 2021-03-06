import request = require('supertest');
import { EquipeServer } from 'test/modules/equipe/equipe.server';
import {
  CriaTecnicoDto,
  TecnicoRespostaDto,
} from 'src/modules/pessoa/dto/tecnico.dto';
import { criaTecnicoDto } from 'test/__MOCKS__/pessoa/tecnico.mock';

export class TecnicoServer {
  readonly equipeServer: EquipeServer;
  constructor(private readonly server: unknown) {
    this.equipeServer = new EquipeServer(this.server);
  }

  async criaTecnicoComEquipe() {
    const resultados = await this.equipeServer.criaEquipeLigaEGinasio();

    const tecnico = await this.criaTecnico(
      criaTecnicoDto(resultados.equipe.id),
    );

    return { ...resultados, tecnico };
  }

  async criaTecnico(requisicao: CriaTecnicoDto): Promise<TecnicoRespostaDto> {
    return request(this.server)
      .post('/pessoa/tecnico')
      .send(requisicao)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }

  async encontraTecnico(id: string): Promise<TecnicoRespostaDto> {
    return request(this.server)
      .get(`/pessoa/tecnico/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => res.body);
  }
}
