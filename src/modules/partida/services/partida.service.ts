import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { groupBy } from 'lodash';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
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
import {
  ArbitroPartidaRepository,
  AtletaEscaladoRepository,
  PartidaRepository,
} from '../repositories';

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

  async encontraPartida(id: string) {
    const partida = await this.deveEncontrarEntidade(id);

    return new PartidaRespostaDto(partida);
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

    await this.arbitroService.deveListarEstritatemente(
      requisicao.arbitros.map((x) => x.idArbitro),
    );

    await Promise.all([
      this.validaAtletas(partida.mandante.idEquipe, requisicao.atletasMandante),
      this.validaAtletas(
        partida.visitante.idEquipe,
        requisicao.atletasVisitante,
      ),
    ]);

    const escalacaoMandante = requisicao.atletasMandante.map((atletaDto) =>
      this.atletaEscaladoRepository.create({
        ...atletaDto,
        idEquipePartida: partida.idMandante,
      }),
    );
    const escalacaoVisitante = requisicao.atletasVisitante.map((atletaDto) =>
      this.atletaEscaladoRepository.create({
        ...atletaDto,
        idEquipePartida: partida.idVisitante,
      }),
    );
    const arbitrosDaPartida = requisicao.arbitros.map((arbitroDto) =>
      this.arbitroPartidaRepository.create({
        ...arbitroDto,
        idPartida: partida.id,
      }),
    );

    partida.status = StatusPartida.PARTICIPANTES_CADASTRADOS;
    partida.idDelegado = delegado.id;

    const partidaAtualizada = await this.connection.transaction(
      async (manager) => {
        const partidaSalva = await manager.save(partida);

        partidaSalva.mandante.atletas = await manager.save(escalacaoMandante);
        partidaSalva.visitante.atletas = await manager.save(escalacaoVisitante);
        partidaSalva.arbitros = await manager.save(arbitrosDaPartida);

        return partidaSalva;
      },
    );

    return new PartidaRespostaDto(partidaAtualizada);
  }

  private async deveEncontrarEntidade(id: string) {
    const partida = await this.partidaRepository.encontraPartidaCompleta(id);
    if (!partida) {
      throw new NotFoundException(`Partida ${id} não encontrada`);
    }

    return partida;
  }

  private validaAtletas(
    idEquipe: string,
    atletas: AtletaParticipacaoDto[],
  ): Promise<AtletaRespostaDto[]> | never {
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

    return this.atletaService.deveListarAtletasEstritamente({
      ids: atletas.map((x) => x.idAtleta),
      idEquipe,
    });
  }

  private async registraDesistencia(partida: Partida) {
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
}
