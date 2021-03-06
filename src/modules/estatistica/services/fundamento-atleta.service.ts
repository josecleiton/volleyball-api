import { Injectable, NotFoundException } from '@nestjs/common';
import pLimit = require('p-limit');
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import { StatusLiga } from 'src/modules/liga/enums/status-liga.enum';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { AtletaEscaladoService } from 'src/modules/partida/services';
import { DataSource } from 'typeorm';
import {
  CriaFundamentoAtletaDto,
  FundamentoAgregadoAtletaRespostaDto,
  FundamentoAtletaRespostaDto,
  ListaFundamentoNaLigaDto,
} from '../dto/fundamento-atleta.dto';
import {
  FundamentoAtletaRepository,
  MelhorCentralViewRepository,
  MelhorLiberoViewRepository,
  MelhorOpostoViewRepository,
} from '../repositories';

@Injectable()
export class FundamentoAtletaService {
  constructor(
    private readonly fundamentoAtletaRepository: FundamentoAtletaRepository,
    private readonly melhorLiberoRepository: MelhorLiberoViewRepository,
    private readonly melhorCentralRepository: MelhorCentralViewRepository,
    private readonly melhorPontaRepository: MelhorOpostoViewRepository,
    private readonly atletaEscaladoService: AtletaEscaladoService,
    private readonly ligaService: LigaService,
    private readonly typeormFilterService: TypeORMFilterService,
    private readonly connection: DataSource,
  ) {}

  async criaFundamento(requisicao: CriaFundamentoAtletaDto) {
    const atletaEscalado =
      await this.atletaEscaladoService.encontraParticipacaoComEquipe(
        requisicao,
      );

    await this.ligaService.excecaoSeALigaStatus(
      atletaEscalado.participacao.equipe.idLiga,
      StatusLiga.CONCLUIDA,
    );

    const fundamento = this.fundamentoAtletaRepository.create({
      ...requisicao,
      idAtletaEscalado: atletaEscalado.id,
    });

    try {
      const fundamentoSalvo = await this.fundamentoAtletaRepository.save(
        fundamento,
      );

      await this.atualizeViews();

      return new FundamentoAtletaRespostaDto(fundamentoSalvo);
    } catch (error) {
      throw this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'FundamentoAtleta',
      });
    }
  }

  async listaFundamentoDeAtleta(idAtleta: string) {
    const fundamentos =
      await this.fundamentoAtletaRepository.listaFundamentoDeAtleta(idAtleta);

    return fundamentos.map((x) => new FundamentoAtletaRespostaDto(x));
  }

  async listaFundamentoNaLiga(requisicao: ListaFundamentoNaLigaDto) {
    const fundamentos =
      await this.fundamentoAtletaRepository.listaFundamentosNaLiga(requisicao);

    return fundamentos.map((x) => new FundamentoAgregadoAtletaRespostaDto(x));
  }

  async removeFundamento(id: string) {
    const fundamento = await this.fundamentoAtletaRepository.findOne({
      where: { id },
      relations: {
        atleta: {
          participacao: {
            equipe: true,
          },
        },
      },
    });

    if (!fundamento) {
      throw new NotFoundException(`Fundamento ${id} n??o encontrado`);
    }

    await this.ligaService.excecaoSeALigaStatus(
      fundamento.atleta.participacao.equipe.idLiga,
      StatusLiga.CONCLUIDA,
    );

    await this.fundamentoAtletaRepository.delete(fundamento.id);

    await this.atualizeViews();
  }

  private async atualizeViews() {
    const limit = pLimit(1);

    await this.connection.transaction(async (manager) => {
      const refreshSincrono = [
        this.melhorLiberoRepository,
        this.melhorCentralRepository,
        this.melhorPontaRepository,
      ].map((repo) => limit(() => repo.refreshMaterializedView(manager)));

      return Promise.all(refreshSincrono);
    });
  }
}
