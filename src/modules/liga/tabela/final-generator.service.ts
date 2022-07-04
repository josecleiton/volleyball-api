import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PartidaFactory } from 'src/modules/partida/factories/partida.factory';
import { PartidaService } from 'src/modules/partida/services/partida.service';
import { PontuacaoService } from 'src/modules/pontuacao/services';
import { SemisEFinalGeneratorService } from './semis-e-final-generator.service';

@Injectable()
export class FinalGeneratorService extends SemisEFinalGeneratorService {
  protected readonly tipoRodada = 'final';

  constructor(
    @Inject(forwardRef(() => PartidaService)) partidaService: PartidaService,
    pontuacaoService: PontuacaoService,
    partidaFactory: PartidaFactory,
  ) {
    super(partidaService, pontuacaoService, partidaFactory);
  }
}
