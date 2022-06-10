import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  EnviaVerificacaoSmsService,
  VerificaCodigoSmsService,
} from './services';
import { MESSAGEBIRD } from './sms.constant';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MESSAGEBIRD,
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
