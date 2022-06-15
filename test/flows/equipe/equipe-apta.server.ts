import pLimit = require('p-limit');
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { EquipeServer } from 'test/modules/equipe/equipe.server';
import { AtletaServer } from 'test/modules/pessoa/atleta/atleta.server';
import { AuxiliarServer } from 'test/modules/pessoa/auxiliar/auxiliar.server';
import { TecnicoServer } from 'test/modules/pessoa/tecnico/tecnico.server';
import { criaAtletaDto } from 'test/__MOCKS__/pessoa/atleta.mock';
import { criaAuxiliarDto } from 'test/__MOCKS__/pessoa/auxiliar.mock';
import { criaTecnicoDto } from 'test/__MOCKS__/pessoa/tecnico.mock';

export class EquipeAptaServer {
  readonly equipe: EquipeServer;
  private readonly atletaServer: AtletaServer;
  private readonly tecnicoServer: TecnicoServer;
  private readonly auxiliarServer: AuxiliarServer;

  constructor(server: unknown) {
    this.equipe = new EquipeServer(server);
    this.atletaServer = new AtletaServer(server);
    this.tecnicoServer = new TecnicoServer(server);
    this.auxiliarServer = new AuxiliarServer(server);
  }

  async tornaEquipeApta(equipe: EquipeRespostaDto) {
    const limit = pLimit(5);

    const reqs: Promise<unknown>[] = [];

    for (let index = 0; index < Equipe.quantidadeAtletasPraAptidao; index++) {
      reqs.push(
        limit(() =>
          this.atletaServer.criaAtleta(criaAtletaDto(equipe.id, index + 1)),
        ),
      );
    }

    reqs.push(
      limit(() => this.tecnicoServer.criaTecnico(criaTecnicoDto(equipe.id))),
      limit(() => this.auxiliarServer.criaAuxiliar(criaAuxiliarDto(equipe.id))),
    );

    await Promise.all(reqs);
  }
}
