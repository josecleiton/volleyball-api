import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { PartidaService } from 'src/modules/partida/partida.service';
import { PontuacaoEquipeService } from '../services/pontuacao-equipe.service';
import { SemisEFinalGeneratorService } from './semis-e-final-generator.service';

@Injectable({ scope: Scope.TRANSIENT })
export class FinalGeneratorService extends SemisEFinalGeneratorService {
  protected readonly tipoRodada = 'final';

  constructor(
    @Inject(forwardRef(() => PartidaService)) partidaService: PartidaService,
    pontuacaoEquipeService: PontuacaoEquipeService,
  ) {
    super(partidaService, pontuacaoEquipeService);
  }
}
