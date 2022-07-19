import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PartidaService, PartidaFactory } from 'src/modules/partida';
import { PontuacaoService } from 'src/modules/pontuacao';
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
