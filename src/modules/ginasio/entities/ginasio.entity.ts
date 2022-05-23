import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('ginasios')
export class Ginasio extends EntidadeBase {
  @Column()
  nome!: string;

  @Column()
  cidade!: string;

  @Column()
  estado!: string;
}
