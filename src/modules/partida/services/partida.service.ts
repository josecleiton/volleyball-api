import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { groupBy } from 'lodash';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { RegistraDesistenciaService } from 'src/modules/pontuacao/services/registra-desistencia.service';
import { Connection } from 'typeorm';
import { Posicao, TipoArbitro } from '../../pessoa/enums';
import { ArbitroService } from '../../pessoa/services/arbitro.service';
import { AtletaService } from '../../pessoa/services/atleta.service';
import { DelegadoService } from '../../pessoa/services/delegado.service';
import {
  AtletaParticipacaoDto,
  CadastrarParticipantesPartidaDto,
  ListaPartidasDto,
  PartidaRespostaDto,
  RemarcarPartidaDto,
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
    private readonly atletaEscaladoRepository: AtletaEscaladoRepository,
    private readonly arbitroPartidaRepository: ArbitroPartidaRepository,
    private readonly delegadoService: DelegadoService,
    private readonly atletaService: AtletaService,
    private readonly arbitroService: ArbitroService,
    private readonly registraDesistenciaService: RegistraDesistenciaService,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
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

  async remarcarPartida(id: string, requisicao: RemarcarPartidaDto) {
    const partida = await this.deveEncontrarEntidade(id);
    if (partida.finalizada) {
      throw new ConflictException(
        `Partida ${id} se encontra finalizada. Status da partida: ${partida.status}`,
      );
    }

    const liga = await this.ligaService.deveEncontrarLigaNaoIniciada(
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
      return this.registraDesistenciaService
        .executar({
          partida,
          desistente: requisicao.desistente,
        })
        .then((resultado) => new PartidaRespostaDto(resultado.partida));
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
}
