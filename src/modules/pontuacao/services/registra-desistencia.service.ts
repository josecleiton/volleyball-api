import { Injectable } from '@nestjs/common';
import { EscolhaDeDesistencia, PontosPartida } from 'src/modules/partida';
import { DataSource } from 'typeorm';
import { IRegistraDesistenciaDto } from '../dtos';
import { RegistraResultadoPartidaFacade } from '../facades';
import { PontuacaoService } from './pontuacao.service';

@Injectable()
export class RegistraDesistenciaService {
  constructor(
    private readonly registraResultadoPartida: RegistraResultadoPartidaFacade,
    private readonly pontuacaoService: PontuacaoService,
    private readonly dataSource: DataSource,
  ) {}
  async executar({ partida, desistente }: IRegistraDesistenciaDto) {
    const mandanteEhDesistente = desistente === EscolhaDeDesistencia.MANDANTE;

    const resultado = mandanteEhDesistente
      ? {
          pontuacaoMandante: PontosPartida.WO,
          pontuacaoVisitante: PontosPartida.VITORIA_PERFEITA,
          setsGanhosMandante: 0,
          setsGanhosVisitante: 3,
          setsMandante: [0, 0, 0],
          setsVisitante: [25, 25, 25],
        }
      : {
          pontuacaoMandante: PontosPartida.VITORIA_PERFEITA,
          pontuacaoVisitante: PontosPartida.WO,
          setsGanhosMandante: 3,
          setsGanhosVisitante: 0,
          setsMandante: [25, 25, 25],
          setsVisitante: [0, 0, 0],
        };

    this.registraResultadoPartida.executa({
      ...resultado,
      partida,
      wo: true,
    });

    const {
      mandante,
      visitante,
      partida: partidaAtualizada,
    } = await this.dataSource.transaction(async (manager) => {
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

    await this.pontuacaoService.atualizaPontuacoes(partida);

    return { partida: partidaAtualizada, mandante, visitante };
  }
}
