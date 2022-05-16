import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Equipe extends EntidadeBase {
  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column()
  urlBrasao?: string;

  @Column({ type: 'boolean' })
  apta = false;

  @Column('jsonb')
  descricaoAptidao: unknown;

  @Column()
  idTecnico!: string;
}
