import { Module } from '@nestjs/common';
import { GinasioService } from './ginasio.service';
import { GinasioController } from './ginasio.controller';
import { GinasioRepository } from './repositories/ginasio.repository';
import { CoreModule } from '../core/core.module';
import { TypeOrmExModule } from '../core/typeorm-ex/typeorm-ex.module';

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
