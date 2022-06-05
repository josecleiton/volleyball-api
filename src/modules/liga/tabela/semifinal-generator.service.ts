import { Injectable, Scope } from '@nestjs/common';
import { PartidaService } from 'src/modules/partida/partida.service';
import { PontuacaoEquipeService } from '../services/pontuacao-equipe.service';
import { SemisEFinalGeneratorService } from './semis-e-final-generator.service';

@Injectable({ scope: Scope.TRANSIENT })
export class SemifinalGeneratorService extends SemisEFinalGeneratorService {
  protected readonly tipoRodada = 'semis';

  constructor(
    partidaService: PartidaService,
    pontuacaoEquipeService: PontuacaoEquipeService,
  ) {
    super(partidaService, pontuacaoEquipeService);
  }
}
