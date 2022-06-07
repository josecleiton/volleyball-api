import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AtletaEscalado } from './atleta-escalado.entity';
import { Partida } from './partida.entity';

@Entity('equipes_partidas')
export class EquipePartida extends EntidadeBase {
  @Column('uuid')
  idEquipe!: string;

  @Column('uuid')
  idPartida!: string;

  @Column({ type: 'int', default: 0 })
  pontuacao!: number;

  @Column({ type: 'int', default: 0 })
  setsGanhos!: number;

  @Column({ type: 'jsonb', default: [] })
  pontosNosSets!: number[];

  @Column({
    name: 'sets_disputados',
    type: 'int',
    insert: false,
    update: false,
  })
  private _setsDisputados!: number;

  @Column({
    name: 'ganhou',
    type: 'int2',
    insert: false,
    update: false,
  })
  private _ganhou!: number;

  public get ganhou(): boolean {
    return this._ganhou === 1;
  }

  public get setsDisputados(): number {
    return this._setsDisputados;
  }

  @Column({ nullable: true })
  resultadoCadastradoEm?: Date;

  @ManyToOne(() => Equipe)
  equipe!: Equipe;

  @ManyToOne(() => Partida)
  partida!: Partida;

  @OneToMany(() => AtletaEscalado, (e) => e.participacao)
  atletas!: AtletaEscalado[];
}
