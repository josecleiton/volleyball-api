import { Module } from '@nestjs/common';
import { GinasioService } from './ginasio.service';
import { GinasioController } from './ginasio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GinasioRepository } from './repositories/ginasio.repository';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([GinasioRepository]), CoreModule],
  controllers: [GinasioController],
  providers: [GinasioService],
  exports: [GinasioService],
})
export class GinasioModule {}
