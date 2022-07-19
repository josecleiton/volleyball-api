import { Injectable } from '@nestjs/common';
import {
  IRegistraEquipeGanhadoraDto,
  Partida,
  StatusPartida,
  EquipePartida,
} from 'src/modules/partida';

@Injectable()
export class RegistraResultadoPartidaFacade {
  executa({
    partida,
    pontuacaoMandante,
    pontuacaoVisitante,
    setsGanhosMandante,
    setsMandante,
    setsGanhosVisitante,
    setsVisitante,
    wo = false,
  }: IRegistraEquipeGanhadoraDto): Partida {
    partida.idGanhadora =
      pontuacaoMandante > pontuacaoVisitante
        ? partida.idMandante
        : partida.idVisitante;
    partida.status = wo ? StatusPartida.WO : StatusPartida.CONCLUIDA;

    partida.mandante.pontuacao = pontuacaoMandante;
    partida.mandante.setsGanhos = setsGanhosMandante;
    partida.mandante.pontosNosSets =
      EquipePartida.unmarshallPontosDoSet(setsMandante);
    partida.mandante.ganhou = partida.idGanhadora === partida.idMandante;

    partida.visitante.pontuacao = pontuacaoVisitante;
    partida.visitante.setsGanhos = setsGanhosVisitante;
    partida.visitante.pontosNosSets =
      EquipePartida.unmarshallPontosDoSet(setsVisitante);
    partida.visitante.ganhou = partida.idGanhadora === partida.idVisitante;

    partida.dataFinalizacao =
      partida.mandante.resultadoCadastradoEm =
      partida.visitante.resultadoCadastradoEm =
        new Date();

    return partida;
  }
}
