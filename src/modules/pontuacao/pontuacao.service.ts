import { Injectable } from '@nestjs/common';
import { PontuacaoRespostaDto } from './dtos/pontuacao.dto';
import { PontuacaoViewRepository } from './repositories/pontuacao-view.repository';

@Injectable()
export class PontuacaoService {
  constructor(private readonly pontuacaoRepository: PontuacaoViewRepository) {}

  async listaPontuacoesOrdenadas(
    idLiga: string,
    limite = 12,
  ): Promise<PontuacaoRespostaDto[]> {
    const pontuacoes = await this.pontuacaoRepository.listaPorLiga(
      idLiga,
      limite,
    );
      
   
    // odernar por pontuação 
    pontuacoes.sort((a,b)=> a.pontuacao > b.pontuacao ? -1:1)
    // TODO: critério de desempate
     
    return pontuacoes.map((x) => new PontuacaoRespostaDto(x));
  }
}
