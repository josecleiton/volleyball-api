import { Injectable, Scope } from '@nestjs/common';
import { TabelaService } from '../services/tabela.service';
import { MataMataGeneratorService } from './mata-mata-generator.service';
import { IClassificados } from '../dto/mata-mata.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class QuartaDeFinalGeneratorService extends MataMataGeneratorService {
  constructor(private readonly tabelaService: TabelaService) {
    super();
  }

  protected readonly tipoRodada = 'quartas';
  protected async listaClassificados(idLiga: string): Promise<IClassificados> {
    const tabelas = await this.tabelaService.encontraTabelaOrdenada(idLiga, 8);
    return {
      equipes: tabelas.map(({ equipe: { id, idGinasio } }) => ({
        id,
        idGinasio,
      })),
    };
  }
}
