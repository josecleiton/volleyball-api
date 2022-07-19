import { getYear } from 'date-fns';
import { EntidadeBase, Genero } from 'src/modules/core';
import { Equipe } from 'src/modules/equipe';
import { Arbitro, Delegado } from 'src/modules/pessoa';
import { Entity, Column, OneToMany } from 'typeorm';
import { StatusLiga } from '../enums';
import { IConfiguraInicializaoLiga } from '../interfaces';

@Entity('ligas')
export class Liga extends EntidadeBase {
  static readonly quantidadeDeEquipesNaLiga = 12;
  static readonly intervaloDeUteisDiasEntreTurnos = 5;
  static readonly quantidadeDeEquipesClassificadas = 8;
  static readonly quantidadeDeRodadasEmClassificatorias = 22;
  static readonly quantidadeDePartidasEmRodadaClassificatoria =
    Liga.quantidadeDeEquipesNaLiga / 2;
  static readonly quantidadeDePartidasNaClassificacao =
    Liga.quantidadeDeRodadasEmClassificatorias *
    Liga.quantidadeDePartidasEmRodadaClassificatoria;

  @Column()
  genero!: Genero;

  @Column({ nullable: true })
  dataComeco?: Date;

  @Column({ type: 'jsonb', nullable: true, select: false })
  configuracaoInicializacaoLiga?: IConfiguraInicializaoLiga;

  @Column({ nullable: true })
  nome?: string;

  @Column({ type: 'varchar', length: 40, nullable: true, default: 'A' })
  serie?: string;

  @Column({ type: 'enum', enum: StatusLiga, default: StatusLiga.CRIADA })
  status!: StatusLiga;

  public get ano(): number | undefined {
    if (!this.dataComeco) return;
    return getYear(this.dataComeco);
  }

  @OneToMany('Equipe', 'liga')
  equipes!: Equipe[];

  @OneToMany('Arbitro', 'liga')
  arbitros!: Arbitro[];

  @OneToMany('Delegado', 'liga')
  delegados!: Delegado[];
}
