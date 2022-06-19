import { Injectable } from '@nestjs/common';
import { EscolhaDeDesistencia } from 'src/modules/partida/dto/partida.dto';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { Connection } from 'typeorm';
import { IRegistraDesistenciaDto } from '../dtos/desistencia.dto';
import { PontuacaoViewRepository } from '../repositories/pontuacao-view.repository';

@Injectable()
export class RegistraDesistenciaService {
  constructor(
    private readonly pontuacaoRepository: PontuacaoViewRepository,
    private readonly connection: Connection,
  ) {}
  async executar({ partida, desistente }: IRegistraDesistenciaDto) {
    partida.status = StatusPartida.WO;
    partida.idGanhadora =
      desistente === EscolhaDeDesistencia.MANDANTE
        ? partida.idVisitante
        : partida.idMandante;
    const pontuacaoMandante =
      partida.idGanhadora === partida.idMandante ? 2 : -2;

    partida.mandante.pontuacao = pontuacaoMandante;
    partida.mandante.pontosNosSets = [25, 25, 25].map((quantidade) => ({
      quantidade,
    }));

    partida.visitante.pontuacao = -partida.mandante.pontuacao;
    partida.visitante.pontosNosSets = [0, 0, 0].map((quantidade) => ({
      quantidade,
    }));

    partida.mandante.resultadoCadastradoEm =
      partida.visitante.resultadoCadastradoEm = new Date();

    const {
      mandante,
      visitante,
      partida: partidaAtualizada,
    } = await this.connection.transaction(async (manager) => {
      const [mandante, visitante] = await manager.save([
        partida.mandante,
        partida.visitante,
      ]);

      await this.pontuacaoRepository.refreshMaterializedView(manager);

      return {
        partida: await manager.save(partida),
        mandante,
        visitante,
      };
    });

    return { partida: partidaAtualizada, mandante, visitante };
  }
}
