import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { chunk, countBy } from 'lodash';
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { PartidaService } from 'src/modules/partida/partida.service';
import { IClassificados } from '../dto/mata-mata.dto';
import { MataMataGeneratorService } from './mata-mata-generator.service';

@Injectable({ scope: Scope.TRANSIENT })
export class SemifinalGeneratorService extends MataMataGeneratorService {
  protected readonly tipoRodada = 'semis';

  constructor(private readonly partidaService: PartidaService) {
    super();
  }

  protected async listaClassificados(idLiga: string): Promise<IClassificados> {
    const partidas = await this.partidaService.listaPartidasOrdenadas({
      idLiga,
      tipoPartida: 'quartas',
      limite: MataMataGeneratorService.quantidadeDePartidasNasQuartas,
    });

    if (
      partidas.length !==
      MataMataGeneratorService.quantidadeDePartidasNasQuartas
    ) {
      throw new InternalServerErrorException(
        `Não foram agendadas 12 partidas para as quartas de final da liga ${idLiga}`,
      );
    }

    const confrontos = chunk(partidas, 3);

    const vencedores = confrontos.map((confronto, index) => {
      const grupoVencedores = countBy(
        confronto,
        (partida) => partida.idEquipeGanhador,
      );

      const vencedor = Object.entries(grupoVencedores).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, quantidadePartidas]) => quantidadePartidas > 1,
      );

      if (!vencedor?.[0] || vencedor[0] === 'undefined') {
        const [partida] = confronto;
        throw new ConflictException(
          `Confronto ${index + 1} entre ${partida.idEquipeMandante} x ${
            partida.idEquipeVisitante
          } não foi definido um vencedor ainda`,
        );
      }

      return vencedor[0];
    });

    const equipeMap: ReadonlyMap<string, EquipeRespostaDto> = new Map(
      partidas
        .filter((partida) => partida.equipeGanhadora)
        .map(({ equipeGanhadora }) => {
          const equipe = equipeGanhadora as EquipeRespostaDto;

          return [equipe.id, equipe];
        }),
    );

    return {
      equipes: vencedores.map(
        (vencedor) => equipeMap.get(vencedor) as EquipeRespostaDto,
      ),
    };
  }
}
