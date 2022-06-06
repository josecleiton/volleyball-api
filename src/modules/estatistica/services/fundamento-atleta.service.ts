import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import * as pLimit from 'p-limit';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import { StatusLiga } from 'src/modules/liga/enums/status-liga.enum';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { AtletaPartidaService } from 'src/modules/partida/services';
import { Connection, EntityManager } from 'typeorm';
import {
  CriaFundamentoAtletaDto,
  FundamentoAtletaRespostaDto,
} from '../dto/fundamento-atleta.dto';
import {
  FundamentoAtletaRepository,
  MelhorLiberoViewRepository,
} from '../repositories';

@Injectable({ scope: Scope.REQUEST })
export class FundamentoAtletaService {
  constructor(
    private readonly fundamentoAtletaRepository: FundamentoAtletaRepository,
    private readonly melhorLiberoRepository: MelhorLiberoViewRepository,
    private readonly atletaPartidaService: AtletaPartidaService,
    private readonly ligaService: LigaService,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly connection: Connection,
  ) {}

  async criaFundamento(requisicao: CriaFundamentoAtletaDto) {
    const atletaPartida =
      await this.atletaPartidaService.encontraParticipacaoComGanhadora(
        requisicao,
      );

    await this.ligaService.excecaoSeALigaStatus(
      atletaPartida.equipeGanhadora.idLiga,
      StatusLiga.CONCLUIDA,
    );

    const fundamento = this.fundamentoAtletaRepository.create({
      ...requisicao,
      idAtletaPartida: atletaPartida.id,
    });

    try {
      const fundamentoSalvo = await this.connection.transaction(
        async (manager) => {
          await this.atualizeViews(manager);
          return manager.save(fundamento);
        },
      );
      return new FundamentoAtletaRespostaDto(fundamentoSalvo);
    } catch (error) {
      throw this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'FundamentoAtleta',
      });
    }
  }

  async removeFundamento(id: string) {
    const fundamento = await this.fundamentoAtletaRepository.findOne({
      where: { id },
      relations: ['atleta', 'atleta.partida', 'atleta.partida.equipeVisitante'],
    });

    if (!fundamento) {
      throw new NotFoundException(`Fundamento ${id} não encontrado`);
    }

    await this.ligaService.excecaoSeALigaStatus(
      fundamento.atleta.partida.equipeVisitante.idLiga,
      StatusLiga.CONCLUIDA,
    );

    await this.connection.transaction(async (manager) => {
      await manager.remove(fundamento);
      await this.atualizeViews(manager);
    });
  }

  private async atualizeViews(manager: EntityManager) {
    const limit = pLimit(1);
    const refreshSincrono = [this.melhorLiberoRepository].map((repo) =>
      limit(() => repo.refreshMaterializedView(manager)),
    );
    return Promise.all(refreshSincrono);
  }
}
