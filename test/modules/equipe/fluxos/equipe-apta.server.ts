import pLimit = require('p-limit');
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { LigaRespostaDto } from 'src/modules/liga/dto/liga.dto';
import { Partida } from 'src/modules/partida/entities/partida.entity';
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

  async criaEquipeApta(liga: LigaRespostaDto) {
    const ginasio = await this.equipe.ginasio.criaGinasio();
    const equipe = await this.equipe.criaEquipe(liga, ginasio);

    await this.tornaEquipeApta(equipe);

    return this.equipe.encontraEquipe(equipe.id);
  }

  async tornaEquipeApta(equipe: EquipeRespostaDto) {
    const limit = pLimit(1);
    await Promise.all(
      [...Array(Partida.máximoDeAtletasNaPartida + 1).keys()].map((_, index) =>
        limit(() =>
          this.atletaServer.criaAtleta(criaAtletaDto(equipe.id, index + 1)),
        ),
      ),
    );

    await Promise.all([
      this.tecnicoServer.criaTecnico(criaTecnicoDto(equipe.id)),
      this.auxiliarServer.criaAuxiliar(criaAuxiliarDto(equipe.id)),
    ]);
  }
}
