import { Module } from '@nestjs/common';
import { TypeORMFilterService } from './services/typeorm-filter.service';

@Module({
  providers: [TypeORMFilterService],
  exports: [TypeORMFilterService],
})
export class CoreModule {}
