import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity('ginasios')
@Index('IX_ginasios_cidade_estado', ['cidade', 'estado'])
@Unique('UQ_ginasios_nome_cidade_estado', ['nome', 'cidade', 'estado'])
export class Ginasio extends EntidadeBase {
  @Column()
  nome!: string;

  @Column()
  @Index()
  cidade!: string;

  @Column()
  @Index()
  estado!: string;
}
