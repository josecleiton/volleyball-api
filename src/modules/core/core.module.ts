import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeORMFilterService } from './services/typeorm-filter.service';
import { VerificaUrlService } from './services/verifica-url.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  providers: [TypeORMFilterService, VerificaUrlService],
  exports: [TypeORMFilterService, VerificaUrlService],
})
export class CoreModule {}
