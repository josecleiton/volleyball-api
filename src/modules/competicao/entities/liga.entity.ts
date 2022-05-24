import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Genero } from 'src/modules/core/enums';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity('ligas')
@Unique(['ano', 'genero', 'serie'])
export class Liga extends EntidadeBase {
  @Column()
  genero!: Genero;

  @Column({ type: 'timestamp with time zone', nullable: true })
  iniciadaEm?: Date;

  @Column({ nullable: true })
  nome?: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  serie?: string;

  @OneToMany(() => Equipe, (e) => e.liga)
  equipes!: Equipe[];

  @Column()
  ano!: string;
}
