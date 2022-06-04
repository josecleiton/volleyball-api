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
import { Liga } from '../entities/liga.entity';
import { PontuacaoEquipeService } from '../services/pontuacao-equipe.service';
import { MataMataGeneratorService } from './mata-mata-generator.service';

@Injectable({ scope: Scope.TRANSIENT })
export class SemifinalGeneratorService extends MataMataGeneratorService {
  protected readonly tipoRodada = 'semis';

  constructor(
    private readonly partidaService: PartidaService,
    private readonly pontuacaoEquipeService: PontuacaoEquipeService,
  ) {
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

    const pontuacoes =
      await this.pontuacaoEquipeService.listaPontuacoesOrdenadas(
        idLiga,
        Liga.quantidadeDeEquipesClassificadas,
      );
    const equipeIdColocacaoMap: ReadonlyMap<string, number> = new Map(
      pontuacoes.map(({ equipe }, index) => [equipe.id, index]),
    );

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

    // Caso a colocação do vencedor da chave a direita seja maior,
    // invertemos a posição com a outra equipe para manter a escolha de mando
    // consistente com as regras
    for (let index = 0; index < vencedores.length / 2 - 1; index++) {
      const voltaIndex = vencedores.length - index - 1;
      const vencedorEsquerda = vencedores[index];
      const vencedorDireita = vencedores[voltaIndex];

      if (
        (equipeIdColocacaoMap.get(vencedorEsquerda) ?? 0) <
        (equipeIdColocacaoMap.get(vencedorDireita) ?? 0)
      ) {
        vencedores[index] = vencedorDireita;
        vencedores[voltaIndex] = vencedorEsquerda;
      }
    }

    return {
      equipes: vencedores.map(
        (vencedor) => equipeMap.get(vencedor) as EquipeRespostaDto,
      ),
    };
  }
}
