import { Column, Entity, OneToMany } from 'typeorm';
import { getYear } from 'date-fns';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Genero } from 'src/modules/core/enums';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Arbitro } from 'src/modules/pessoa/entities/arbitro.entity';
import { Delegado } from 'src/modules/pessoa/entities/delegado.entity';
import { IConfiguraInicializaoLiga } from '../interfaces/configura-inicializacao-liga.interface';

@Entity('ligas')
export class Liga extends EntidadeBase {
  static readonly minimoDeEquipesNaLiga = 12;
  static readonly intervaloDeDiasEntreTurnos = 14;

  @Column()
  genero!: Genero;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dataComeco?: Date;

  @Column({ type: 'jsonb', nullable: true })
  configuracaoInicializacaoLiga?: IConfiguraInicializaoLiga;

  @Column({ nullable: true })
  nome?: string;

  @Column({ type: 'varchar', length: 40, nullable: true, default: 'A' })
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
