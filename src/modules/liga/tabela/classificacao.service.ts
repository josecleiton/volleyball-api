import { NotImplementedException } from '@nestjs/common';
import { nextMonday } from 'date-fns';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Partida } from 'src/modules/partida/entities/partida.entity';

interface IClassificacaoGeneratorRequestDto {
  equipe: Equipe;
  posicao: number;
}

export class ClassificacaoGenerator {
  private jogosNaRodada = 0;
  constructor(
    private readonly quantidadeDeEquipes: number,
    private dataInicio: Date,
  ) {}

  geraIdaEVolta(
    mandante: IClassificacaoGeneratorRequestDto,
    visitante: IClassificacaoGeneratorRequestDto,
  ): [Partida, Partida] {
    if (this.todosJogosDaRodadaGerados) {
      this.dataInicio = nextMonday(this.dataInicio);
      this.jogosNaRodada = 0;
    }
    throw new NotImplementedException(
      'Ainda não implementamos a geração de partida',
    );
  }

  private get todosJogosDaRodadaGerados(): boolean {
    return this.jogosNaRodada === this.quantidadeDeEquipes;
  }
}
