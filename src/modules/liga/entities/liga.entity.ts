import { Column, Entity, OneToMany } from 'typeorm';
import { getYear } from 'date-fns';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Genero } from 'src/modules/core/enums';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Arbitro } from 'src/modules/pessoa/entities/arbitro.entity';
import { Delegado } from 'src/modules/pessoa/entities/delegado.entity';

@Entity('ligas')
export class Liga extends EntidadeBase {
  static minimoDeEquipesNaLiga = 10;

  @Column()
  genero!: Genero;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dataComeco?: Date;

  @Column({ nullable: true })
  nome?: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  serie?: string;

  public get ano(): number | undefined {
    if (!this.dataComeco) return;
    return getYear(this.dataComeco);
  }

  @OneToMany(() => Equipe, (e) => e.liga)
  equipes!: Equipe[];

  @OneToMany(() => Arbitro, (a) => a.liga)
  arbitros!: Arbitro[];

  @OneToMany(() => Delegado, (d) => d.liga)
  delegados!: Delegado[];
}
