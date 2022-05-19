import { Module } from '@nestjs/common';
import { LigaService } from './liga.service';
import { LigaController } from './liga.controller';

@Module({
  controllers: [LigaController],
  providers: [LigaService],
})
export class LigaModule {}
