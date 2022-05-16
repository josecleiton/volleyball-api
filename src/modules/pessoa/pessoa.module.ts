import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TecnicoController } from './controllers/tecnico.controller';
import { TecnicoRepository } from './repositories/tecnico.repository';
import { TecnicoService } from './services/tecnico.service';

@Module({
  imports: [TypeOrmModule.forFeature([TecnicoRepository])],
  controllers: [TecnicoController],
  providers: [TecnicoService],
})
export class PessoaModule {}
