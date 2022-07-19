import { Module } from '@nestjs/common';
import { TypeORMFilterService, VerificaUrlService } from './services';

@Module({
  providers: [TypeORMFilterService, VerificaUrlService],
  exports: [TypeORMFilterService, VerificaUrlService],
})
export class CoreModule {}
