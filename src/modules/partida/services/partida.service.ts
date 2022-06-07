import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { groupBy } from 'lodash';
import { PontuacaoViewRepository } from 'src/modules/pontuacao/repositories/pontuacao-view.repository';
import { Connection } from 'typeorm';
import { Posicao, TipoArbitro } from '../../pessoa/enums';
import { ArbitroService } from '../../pessoa/services/arbitro.service';
import { AtletaService } from '../../pessoa/services/atleta.service';
import { DelegadoService } from '../../pessoa/services/delegado.service';
import {
  AtletaParticipacaoDto,
  CadastrarParticipantesPartidaDto,
  EscolhaDeDesistencia,
  ListaPartidasDto,
  PartidaRespostaDto,
} from '../dto/partida.dto';
import { Partida } from '../entities/partida.entity';
import { StatusPartida } from '../enums/status-partida.enum';
import { ArbitroPartidaRepository } from '../repositories/arbitro-partida.repository';
import { AtletaEscaladoRepository } from '../repositories/atleta-escalado.repository';
import { PartidaRepository } from '../repositories/partida.repository';

@Injectable()
export class PartidaService {
  constructor(
    private readonly partidaRepository: PartidaRepository,
    private readonly pontuacaoRepository: PontuacaoViewRepository,
    private readonly atletaEscaladoRepository: AtletaEscaladoRepository,
    private readonly arbitroPartidaRepository: ArbitroPartidaRepository,
    private readonly delegadoService: DelegadoService,
    private readonly atletaService: AtletaService,
    private readonly arbitroService: ArbitroService,
    private readonly connection: Connection,
  ) {}

  async listaPartidasOrdenadas(
    requisicao: ListaPartidasDto,
  ): Promise<PartidaRespostaDto[]> {
    const partidas = await this.partidaRepository.listaPartidasOrdenadas(
      requisicao,
    );

    return partidas.map((x) => new PartidaRespostaDto(x));
  }

  private async deveEncontrarEntidade(id: string) {
    const partida = await this.partidaRepository.findOne({
      where: { id },
    });
    if (!partida) {
      throw new NotFoundException(`Partida ${id} não encontrada`);
    }

    return partida;
  }

  private validaAtletas(
    idEquipe: string,
    atletas: AtletaParticipacaoDto[],
  ): void | never {
    const atletasPorPosicao = groupBy(atletas, (a) => a.posicao);
    if (
      atletas.length === Partida.minimoDeAtletasNaPartida &&
      atletasPorPosicao[Posicao.LIBERO]?.length
    ) {
      throw new BadRequestException(
        `Equipe ${idEquipe} com o mínimo de atletas relacionados, um líbero não pode ser relacionado`,
      );
    }

    if (
      atletas.length > Partida.minimoDeAtletasNaPartida &&
      atletasPorPosicao[Posicao.LIBERO]?.length &&
      atletasPorPosicao[Posicao.LIBERO].length > Partida.maximoDeLiberos
    ) {
      throw new BadRequestException(
        `Em uma equipe ${idEquipe} com ${atletas.length} não pode ter mais do que ${Partida.maximoDeLiberos} líberos`,
      );
    }
  }

  private async registraDesistencia(partida: Partida) {
    const pontuacaoMandante =
      partida.idGanhadora === partida.idMandante ? 2 : -2;

    partida.mandante.pontuacao = pontuacaoMandante;
    partida.visitante.pontuacao = -partida.mandante.pontuacao;

    const { partida: partidaAtualizada } = await this.connection.transaction(
      async (manager) => {
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
      },
    );

    return partidaAtualizada;
  }

  async cadastrarParticipantes(
    id: string,
    requisicao: CadastrarParticipantesPartidaDto,
  ) {
    const partida = await this.deveEncontrarEntidade(id);
    if (partida.status !== StatusPartida.AGENDADA) {
      throw new ConflictException(
        `Partida ${id} não está no status ${StatusPartida.AGENDADA}`,
      );
    }

    const delegado = await this.delegadoService.deveEncontrarUm(
      requisicao.idDelegado,
    );

    if (requisicao.desistente) {
      partida.status = StatusPartida.WO;
      partida.idGanhadora =
        requisicao.desistente === EscolhaDeDesistencia.MANDANTE
          ? partida.idVisitante
          : partida.idMandante;

      return new PartidaRespostaDto(await this.registraDesistencia(partida));
    }

    const arbitrosPorTipo = groupBy(
      requisicao.arbitros,
      (arbitro) => arbitro.tipo,
    );

    if (!arbitrosPorTipo[TipoArbitro.PRINCIPAL]?.length) {
      throw new BadRequestException(
        'É necessário ao menos um árbitro principal',
      );
    }

    await this.arbitroService.deveListarPorId(
      requisicao.arbitros.map((x) => x.idArbitro),
    );

    this.validaAtletas(partida.idMandante, requisicao.atletasMandante);
    this.validaAtletas(partida.idVisitante, requisicao.atletasVisitante);

    await this.atletaService.deveListarPorId(
      [...requisicao.atletasMandante, ...requisicao.atletasVisitante].map(
        (x) => x.idAtleta,
      ),
    );

    const escalacaoMandante = requisicao.atletasMandante.map((atletaDto) =>
      this.atletaEscaladoRepository.create({ ...atletaDto }),
    );
    const escalacaoVisitante = requisicao.atletasVisitante.map((atletaDto) =>
      this.atletaEscaladoRepository.create({ ...atletaDto }),
    );
    const arbitrosDaPartida = requisicao.arbitros.map((arbitroDto) =>
      this.arbitroPartidaRepository.create({ ...arbitroDto }),
    );

    partida.status = StatusPartida.PARTICIPANTES_CADASTRADOS;
    partida.idDelegado = delegado.id;

    const partidaAtualizada = await this.connection.transaction(
      async (manager) => {
        const partidaSalva = await manager.save(partida);

        await manager.save(escalacaoMandante);
        await manager.save(escalacaoVisitante);
        await manager.save(arbitrosDaPartida);

        partidaSalva.arbitros = arbitrosDaPartida;
        partidaSalva.mandante.atletas = escalacaoMandante;
        partidaSalva.visitante.atletas = escalacaoVisitante;

        return partidaSalva;
      },
    );

    return new PartidaRespostaDto(partidaAtualizada);
  }
}
