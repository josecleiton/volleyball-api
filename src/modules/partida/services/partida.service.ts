/* eslint-disable no-empty */
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { groupBy } from 'lodash';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { RegistraResultadoPartidaFacade } from 'src/modules/pontuacao/facades';
import { PontuacaoService } from 'src/modules/pontuacao/services';
import { RegistraDesistenciaService } from 'src/modules/pontuacao/services/registra-desistencia.service';
import { Connection, EntityManager } from 'typeorm';
import { Posicao, TipoArbitro } from '../../pessoa/enums';
import { ArbitroService } from '../../pessoa/services/arbitro.service';
import { AtletaService } from '../../pessoa/services/atleta.service';
import { DelegadoService } from '../../pessoa/services/delegado.service';
import { CadastrarResultadoPartidaDto } from '../dto/partida-cadastro-resultado.dto';

import {
  AtletaParticipacaoDto,
  CadastrarParticipantesPartidaDto,
  ListaPartidasDto,
  PartidaRespostaDto,
  RemarcarPartidaDto,
} from '../dto/partida.dto';
import { Partida } from '../entities/partida.entity';
import { PontosPartida } from '../enums/pontos-partida.enum';
import { StatusPartida } from '../enums/status-partida.enum';
import {
  ArbitroPartidaRepository,
  AtletaEscaladoRepository,
  PartidaRepository,
} from '../repositories';

interface IDeterminaPontuacaoNumeroDeSets {
  setsGanhosMandante: number;
  setsGanhosVisitante: number;
}

@Injectable()
export class PartidaService {
  static readonly máximoDePontoNoSetParaVitoriaSemOvertime = 25;
  static readonly diferençaDePontosNoSetParaVencerApósOvertime = 2;
  static readonly máximoDeSetsParaVitória = 5;

  constructor(
    private readonly partidaRepository: PartidaRepository,
    private readonly atletaEscaladoRepository: AtletaEscaladoRepository,
    private readonly arbitroPartidaRepository: ArbitroPartidaRepository,
    private readonly delegadoService: DelegadoService,
    private readonly atletaService: AtletaService,
    private readonly arbitroService: ArbitroService,
    private readonly registraDesistenciaService: RegistraDesistenciaService,
    private readonly registraResultadoPartida: RegistraResultadoPartidaFacade,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
    private readonly connection: Connection,
    private readonly pontuacaoService: PontuacaoService,
  ) {}

  async listaPartidasOrdenadas(
    requisicao: ListaPartidasDto,
  ): Promise<PartidaRespostaDto[]> {
    const partidas = await this.partidaRepository.listaPartidasOrdenadas(
      requisicao,
    );

    return partidas
      .slice(0, requisicao.limite ?? partidas.length)
      .map((x) => new PartidaRespostaDto(x));
  }

  async encontraPartida(id: string) {
    const partida = await this.deveEncontrarEntidade(id);

    return new PartidaRespostaDto(partida);
  }

  async remarcarPartida(id: string, requisicao: RemarcarPartidaDto) {
    const partida = await this.deveEncontrarEntidade(id);
    if (partida.finalizada) {
      throw new ConflictException(
        `Partida ${id} se encontra finalizada. Status da partida: ${partida.status}`,
      );
    }

    const liga = await this.ligaService.deveEncontrarLigaIniciada(
      partida.mandante.equipe.idLiga,
    );
    if (requisicao.data < liga.dataComeco) {
      throw new ConflictException(
        `Nova data da partida deve ser maior que a data de início da liga ${liga.id}`,
      );
    }

    await this.partidaRepository.update(partida.id, {
      dataComeco: requisicao.data,
    });

    partida.dataComeco = requisicao.data;

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
      await this.registraDesistenciaService.executar({
        partida,
        desistente: requisicao.desistente,
      });

      return this.deveEncontrarEntidade(partida.id).then(
        (resultado) => new PartidaRespostaDto(resultado),
      );
    }

    const arbitrosPorTipo = groupBy(
      requisicao.arbitros,
      (arbitro) => arbitro.tipo,
    );

    if (
      arbitrosPorTipo[TipoArbitro.PRINCIPAL]?.length !==
      Partida.máximoDeÁrbitrosPrimários
    ) {
      throw new UnprocessableEntityException(
        'É necessário apenas um árbitro principal',
      );
    }

    const quantidadeDeArbitrosSecundários =
      arbitrosPorTipo[TipoArbitro.SECUNDÁRIO]?.length;
    if (
      quantidadeDeArbitrosSecundários &&
      quantidadeDeArbitrosSecundários > Partida.máximoDeÁrbitrosSecundários
    ) {
      throw new UnprocessableEntityException(
        `É necessário apenas ${Partida.máximoDeÁrbitrosSecundários} árbitro secundário`,
      );
    }

    const quantidadeDeJuízesDeQuadra =
      arbitrosPorTipo[TipoArbitro.QUADRA]?.length;
    if (
      quantidadeDeJuízesDeQuadra &&
      quantidadeDeJuízesDeQuadra > Partida.máximoDeJuízesDeQuadra
    ) {
      throw new UnprocessableEntityException(
        `É necessário até ${Partida.máximoDeJuízesDeQuadra} juízes de quadra`,
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

    await this.connection.transaction(async (manager) => {
      const partidaSalva = await manager.save(partida);

      partidaSalva.mandante.atletas = await manager.save(escalacaoMandante);
      partidaSalva.visitante.atletas = await manager.save(escalacaoVisitante);
      partidaSalva.arbitros = await manager.save(arbitrosDaPartida);

      return partidaSalva;
    });

    return new PartidaRespostaDto(await this.deveEncontrarEntidade(partida.id));
  }

  private async deveEncontrarEntidade(id: string, manager?: EntityManager) {
    const repository =
      manager?.getCustomRepository(PartidaRepository) ?? this.partidaRepository;
    const partida = await repository.encontraPartidaCompleta(id);
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
    const quantidadeDeLiberos: number | undefined =
      atletasPorPosicao[Posicao.LIBERO]?.length;

    const quantidadeDeLiberosEhValida =
      quantidadeDeLiberos <= Partida.máximoDeLíberos;

    if (
      atletas.length === Partida.mínimoDeAtletasNaPartida &&
      quantidadeDeLiberos &&
      !quantidadeDeLiberosEhValida
    ) {
      throw new UnprocessableEntityException(
        `Equipe ${idEquipe} com o mínimo de atletas relacionados, não pode haver mais que ${Partida.máximoDeLíberos} líberos. PS: nesse caso nenhum líbero pode ser escalado também`,
      );
    }

    if (
      atletas.length > Partida.mínimoDeAtletasNaPartida &&
      !quantidadeDeLiberosEhValida
    ) {
      throw new UnprocessableEntityException(
        `Em uma equipe ${idEquipe} com ${atletas.length} tem que ter ao menos 1 líbero e não pode ter mais do que ${Partida.máximoDeLíberos}. Recebido: ${quantidadeDeLiberos}`,
      );
    }

    return this.atletaService.deveListarAtletasEstritamente({
      ids: atletas.map((x) => x.idAtleta),
      idEquipe,
    });
  }

  async cadastrarResultado(
    id: string,
    { setsMandante, setsVisitante }: CadastrarResultadoPartidaDto,
  ) {
    const partida = await this.deveEncontrarEntidade(id);

    if (partida.status !== StatusPartida.PARTICIPANTES_CADASTRADOS) {
      throw new UnprocessableEntityException(
        `A partida precisa está com status : '${StatusPartida.PARTICIPANTES_CADASTRADOS}' para cadastrar um resultado`,
      );
    }

    if (
      setsMandante.length !== setsVisitante.length &&
      setsMandante.some(
        (_, index) => setsMandante[index] === setsVisitante[index],
      )
    ) {
      throw new UnprocessableEntityException(
        `O array de pontosNosSets precisa ter o mesmo tamanho e não pode ter valores iguais na mesma posição`,
      );
    }

    const setComFalha = setsMandante.findIndex((_, index) => {
      const pontosMandante = setsMandante[index];
      const pontosVisitante = setsVisitante[index];

      return (
        pontosMandante + pontosVisitante >=
          PartidaService.máximoDePontoNoSetParaVitoriaSemOvertime * 2 &&
        Math.abs(pontosMandante - pontosVisitante) !==
          PartidaService.diferençaDePontosNoSetParaVencerApósOvertime
      );
    });

    if (setComFalha !== -1) {
      throw new UnprocessableEntityException(
        `A diferença entre pontos no set ${setComFalha + 1} deve ser igual a 2`,
      );
    }

    const { mandante: setsGanhosMandante, visitante: setsGanhosVisitante } =
      setsMandante.reduce(
        (prev, _, index) => {
          const mandanteVenceu = setsMandante[index] > setsVisitante[index];
          return {
            mandante: prev.mandante + (mandanteVenceu ? 1 : 0),
            visitante: prev.visitante + (mandanteVenceu ? 0 : 1),
          };
        },
        { mandante: 0, visitante: 0 },
      );

    if (
      setsGanhosMandante + setsGanhosVisitante >
      PartidaService.máximoDeSetsParaVitória
    ) {
      throw new UnprocessableEntityException(
        ` Para haver ganhador precisa ter pelo menos uma equipe com 3 sets vencidos
        além de não poder ter um equipe com mais de 3 sets ganhos`,
      );
    }

    const [pontuacaoMandante, pontuacaoVisitante] =
      this.determinaPontuacaoPorNumeroDeSets({
        setsGanhosMandante,
        setsGanhosVisitante,
      });

    this.registraResultadoPartida.executa({
      partida,
      pontuacaoMandante,
      pontuacaoVisitante,
      setsGanhosMandante,
      setsGanhosVisitante,
      setsMandante,
      setsVisitante,
    });

    const partidaAtualizada = await this.connection.transaction(
      async (manager) => {
        await manager.save([partida.mandante, partida.visitante]);

        await manager.save(partida);

        return this.deveEncontrarEntidade(partida.id, manager);
      },
    );

    await this.pontuacaoService.atualizaPontuacoes(partidaAtualizada);

    return new PartidaRespostaDto(partidaAtualizada);
  }

  private determinaPontuacaoPorNumeroDeSets({
    setsGanhosMandante,
    setsGanhosVisitante,
  }: IDeterminaPontuacaoNumeroDeSets): [PontosPartida, PontosPartida] {
    const mandanteVenceu = setsGanhosMandante > setsGanhosVisitante;

    if (
      setsGanhosMandante + setsGanhosVisitante <
      PartidaService.máximoDeSetsParaVitória
    ) {
      return mandanteVenceu
        ? [PontosPartida.VITORIA_PERFEITA, PontosPartida.DERROTA_FEIA]
        : [PontosPartida.DERROTA_FEIA, PontosPartida.VITORIA_PERFEITA];
    }

    return mandanteVenceu
      ? [PontosPartida.VITORIA_SIMPLES, PontosPartida.DERROTA_SIMPLES]
      : [PontosPartida.DERROTA_SIMPLES, PontosPartida.VITORIA_SIMPLES];
  }
}
