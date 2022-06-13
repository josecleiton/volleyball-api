import { INestApplication } from '@nestjs/common';
import { initTestingApp } from 'test/modules/helpers/init-testingapp.helper';
import { criaTecnicoDto } from 'test/__MOCKS__/pessoa/tecnico.mock';
import { TecnicoServer } from './tecnico.server';

describe('TecnicoController (e2e)', () => {
  let app: INestApplication;
  let server: TecnicoServer;

  beforeEach(async () => {
    app = await initTestingApp();
    server = new TecnicoServer(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  it('/pessoa/tecnico (POST)', async () => {
    const { equipe } = await server.equipeServer.criaEquipeLigaEGinasio();

    const requisicao = criaTecnicoDto(equipe.id);

    const tecnico = await server.criaTecnico(requisicao);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataNascimento, ...toMatch } = requisicao;

    expect(tecnico).toEqual(expect.objectContaining(toMatch));
  });
});
