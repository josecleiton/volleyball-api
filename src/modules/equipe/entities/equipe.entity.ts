import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Tecnico } from 'src/modules/pessoa/entities/tecnico.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Equipe extends EntidadeBase {
  @Column({ type: 'varchar', length: 255, unique: true })
  nome!: string;

  @Column({ nullable: true })
  urlBrasao?: string;

  @Column({ type: 'boolean', default: false })
  apta = false;

  @Column({ type: 'jsonb', nullable: true })
  descricaoAptidao?: unknown;

  @OneToOne(() => Tecnico, (t) => t.equipe)
  tecnico!: Tecnico;
}
