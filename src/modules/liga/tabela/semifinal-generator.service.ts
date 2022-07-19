import { Injectable } from '@nestjs/common';
import { PartidaService, PartidaFactory } from 'src/modules/partida';
import { PontuacaoService } from 'src/modules/pontuacao';
import { SemisEFinalGeneratorService } from './semis-e-final-generator.service';

@Injectable()
export class SemifinalGeneratorService extends SemisEFinalGeneratorService {
  protected readonly tipoRodada = 'semis';

  constructor(
    partidaService: PartidaService,
    pontuacaoService: PontuacaoService,
    partidaFactory: PartidaFactory,
  ) {
    super(partidaService, pontuacaoService, partidaFactory);
  }
}
