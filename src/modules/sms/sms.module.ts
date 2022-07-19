import { Module, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EnviaVerificacaoSmsService,
  VerificaCodigoSmsService,
} from './services';
import { MESSAGEBIRD } from './sms.constant';

@Module({
  providers: [
    {
      provide: MESSAGEBIRD,
      scope: Scope.DEFAULT,
      useFactory: (configService: ConfigService) => {
        // TODO: BIZARRO
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('messagebird')(configService.get('MESSAGEBIRD_KEY'));
      },
      inject: [ConfigService],
    },
    EnviaVerificacaoSmsService,
    VerificaCodigoSmsService,
  ],
  exports: [EnviaVerificacaoSmsService, VerificaCodigoSmsService],
})
export class SmsModule {}
