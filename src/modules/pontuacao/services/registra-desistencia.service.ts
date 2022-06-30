import { Injectable } from '@nestjs/common';
import { EscolhaDeDesistencia } from 'src/modules/partida/dto/partida.dto';
import { EquipePartida } from 'src/modules/partida/entities/equipe-partida.entity';
import { PontosPartida } from 'src/modules/partida/enums/pontos-partida.enum';
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
    const mandanteEhDesistente = desistente === EscolhaDeDesistencia.MANDANTE;

    partida.status = StatusPartida.WO;

    const ganhadora = mandanteEhDesistente
      ? partida.visitante
      : partida.mandante;
    const perdedora = mandanteEhDesistente
      ? partida.mandante
      : partida.visitante;

    partida.idGanhadora = ganhadora.id;
    partida.ganhadora = ganhadora;

    ganhadora.pontosNosSets = EquipePartida.unmarshallPontosDoSet([25, 25, 25]);
    ganhadora.pontuacao = PontosPartida.VITORIA_PERFEITA;
    ganhadora.setsGanhos = ganhadora.pontosNosSets.length;
    ganhadora.ganhou = true;

    perdedora.pontosNosSets = EquipePartida.unmarshallPontosDoSet([0, 0, 0]);
    perdedora.pontuacao = PontosPartida.WO;

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

      return {
        partida: await manager.save(partida),
        mandante,
        visitante,
      };
    });

    await this.pontuacaoRepository.refreshMaterializedView();

    return { partida: partidaAtualizada, mandante, visitante };
  }
}
