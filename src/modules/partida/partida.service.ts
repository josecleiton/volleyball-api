import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  Scope,
} from '@nestjs/common';
import { groupBy } from 'lodash';
import { Connection } from 'typeorm';
import { Equipe } from '../equipe/entities/equipe.entity';
import { Posicao, TipoArbitro } from '../pessoa/enums';
import { ArbitroService } from '../pessoa/services/arbitro.service';
import { AtletaService } from '../pessoa/services/atleta.service';
import { DelegadoService } from '../pessoa/services/delegado.service';
import {
  AtletaPartidaDto,
  CadastrarParticipantesPartidaDto,
  PartidaRespostaDto,
} from './dto/partida.dto';
import { IPontuacaoPartidaDto } from './dto/pontuacao-partida.dto';
import { Partida } from './entities/partida.entity';
import { PartidaStatus } from './enums/partida-status.enum';
import { ArbitroPartidaRepository } from './repositories/arbitro-partida.repository';
import { AtletaPartidaRepository } from './repositories/atleta-partida.repository';
import { PartidaRepository } from './repositories/partida.repository';
import { PontuacaoPartidaRepository } from './repositories/pontuacao-partida.repository';

@Injectable({ scope: Scope.REQUEST })
export class PartidaService {
  constructor(
    private readonly partidaRepository: PartidaRepository,
    private readonly atletaPartidaRepository: AtletaPartidaRepository,
    private readonly arbitroPartidaRepository: ArbitroPartidaRepository,
    private readonly pontuacaoPartidaRepository: PontuacaoPartidaRepository,
    private readonly delegadoService: DelegadoService,
    private readonly atletaService: AtletaService,
    private readonly arbitroService: ArbitroService,
    private readonly connection: Connection,
  ) {}

  async listaPartidas(idLiga: string) {
    throw new NotImplementedException(idLiga);
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
    atletas: AtletaPartidaDto[],
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
      partida.idEquipeGanhador === partida.idMandante ? 2 : -2;
    const pontuacaoPartida = this.pontuacaoPartidaRepository.create({
      id: partida.id,
      visitante: -pontuacaoMandante,
      mandante: pontuacaoMandante,
    });

    const partidaAtualizada = await this.connection.transaction(
      async (manager) => {
        await manager.save(pontuacaoPartida);
        return manager.save(partida);
      },
    );

    partidaAtualizada.pontuacao = pontuacaoPartida;

    return partidaAtualizada;
  }

  async cadastrarParticipantes(
    id: string,
    requisicao: CadastrarParticipantesPartidaDto,
  ) {
    const partida = await this.deveEncontrarEntidade(id);
    if (partida.status !== PartidaStatus.AGENDADA) {
      throw new ConflictException(
        `Partida ${id} não está no status ${PartidaStatus.AGENDADA}`,
      );
    }

    const delegado = await this.delegadoService.deveEncontrarUm(
      requisicao.idDelegado,
    );

    if (requisicao.desistente) {
      partida.status = PartidaStatus.WO;
      partida.idEquipeGanhador =
        requisicao.desistente === 'mandante'
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

    const atletasMandantePartida = requisicao.atletasMandante.map((atletaDto) =>
      this.atletaPartidaRepository.create({ ...atletaDto }),
    );
    const atletasVisitantePartida = requisicao.atletasVisitante.map(
      (atletaDto) => this.atletaPartidaRepository.create({ ...atletaDto }),
    );
    const arbitrosPartida = requisicao.arbitros.map((arbitroDto) =>
      this.arbitroPartidaRepository.create({ ...arbitroDto }),
    );

    partida.status = PartidaStatus.PARTICIPANTES_CADASTRADOS;
    partida.idDelegado = delegado.id;

    const partidaAtualizada = await this.connection.transaction(
      async (manager) => {
        const partidaSalva = await manager.save(partida);

        await manager.save(atletasMandantePartida);
        await manager.save(atletasVisitantePartida);
        await manager.save(arbitrosPartida);

        partidaSalva.arbitros = arbitrosPartida;
        partidaSalva.atletasMandante = atletasMandantePartida;
        partidaSalva.atletasVisitante = atletasVisitantePartida;

        return partidaSalva;
      },
    );

    return new PartidaRespostaDto(partidaAtualizada);
  }

  finalizaPartida(
    partida: Partida,
    equipeGanhadora: Equipe,
    pontuacaoDto: IPontuacaoPartidaDto,
  ) {
    if (partida.status !== PartidaStatus.PARTICIPANTES_CADASTRADOS) {
      throw new ConflictException(
        `Partida ${partida.id} não está no status ${PartidaStatus.PARTICIPANTES_CADASTRADOS}`,
      );
    }

    partida.idEquipeGanhador = equipeGanhadora.id;
    partida.status = PartidaStatus.CONCLUIDA;

    const pontuacaoMandante =
      partida.idEquipeGanhador === partida.idMandante
        ? pontuacaoDto.ganhador
        : pontuacaoDto.perdedor;
    const pontuacaoVisitante =
      pontuacaoMandante === pontuacaoDto.ganhador
        ? pontuacaoDto.perdedor
        : pontuacaoDto.ganhador;

    partida.pontuacao = this.pontuacaoPartidaRepository.create({
      id: partida.id,
      mandante: pontuacaoMandante,
      visitante: pontuacaoVisitante,
    });

    throw new NotImplementedException();
  }
}
