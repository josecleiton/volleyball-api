import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EnviaVerificacaoSmsService,
  VerificaCodigoSmsService,
} from './services';
import { MESSAGEBIRD } from './sms.constant';
import initMB from 'messagebird';

@Module({
  providers: [
    {
      provide: MESSAGEBIRD,
      useFactory: (configService: ConfigService) =>
        initMB(configService.get('MESSAGEBIRD_KEY') as string),
      inject: [ConfigService],
    },
    EnviaVerificacaoSmsService,
    VerificaCodigoSmsService,
  ],
  exports: [EnviaVerificacaoSmsService, VerificaCodigoSmsService],
})
export class SmsModule {}
