import { Injectable, Scope } from '@nestjs/common';
import { SemisEFinalGeneratorService } from './semis-e-final-generator.service';

@Injectable({ scope: Scope.TRANSIENT })
export class FinalGeneratorService extends SemisEFinalGeneratorService {
  protected readonly tipoRodada = 'final';
}
