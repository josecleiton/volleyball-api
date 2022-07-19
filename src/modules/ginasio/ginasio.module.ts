import { Module } from '@nestjs/common';
import { TypeOrmExModule, CoreModule } from '../core';
import { GinasioController } from './ginasio.controller';
import { GinasioService } from './ginasio.service';
import { GinasioRepository } from './repositories';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([GinasioRepository]),
    CoreModule,
  ],
  controllers: [GinasioController],
  providers: [GinasioService],
  exports: [GinasioService],
})
export class GinasioModule {}
