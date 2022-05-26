import { Module } from '@nestjs/common';
import { TypeORMFilterService } from './services/typeorm-filter.service';
import { VerificaUrlService } from './services/verifica-url.service';

@Module({
  providers: [TypeORMFilterService, VerificaUrlService],
  exports: [TypeORMFilterService, VerificaUrlService],
})
export class CoreModule {}
