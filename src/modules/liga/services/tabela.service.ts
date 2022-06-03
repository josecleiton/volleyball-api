import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TabelaRespostaDto } from '../dto/tabela.dto';
import { TabelaRepository } from '../repositories/tabela.repository';

@Injectable({ scope: Scope.REQUEST })
export class TabelaService {
  constructor(private readonly tabelaRepository: TabelaRepository) {}

  async encontraTabelaOrdenada(
    idLiga: string,
    limite?: number,
  ): Promise<TabelaRespostaDto[]> {
    const tabelas = await this.tabelaRepository.listaTabelaOrdenadaPorLiga(
      idLiga,
      limite,
    );

    if (!tabelas?.length) {
      throw new NotFoundException(
        `Tabelas para a liga ${idLiga} não foram encontradas`,
      );
    }

    return tabelas.map((x) => new TabelaRespostaDto(x));
  }
}
