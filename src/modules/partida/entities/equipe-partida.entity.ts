import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IPontoNoSet } from '../interfaces/ponto_no_set.interface';
import { AtletaEscalado } from './atleta-escalado.entity';
import { Partida } from './partida.entity';

@Entity('equipes_partidas')
export class EquipePartida extends EntidadeBase {
  static unmarshallPontosDoSet(pontos: number[]): IPontoNoSet[] {
    return pontos.map((quantidade) => ({ quantidade }));
  }

  @Column('uuid')
  idEquipe!: string;

  @Column({ type: 'uuid', nullable: true })
  idPartida?: string;

  @Column({ type: 'int', default: 0 })
  pontuacao!: number;

  @Column({ type: 'int', default: 0 })
  setsGanhos!: number;

  @Column({ type: 'jsonb', default: [] })
  pontosNosSets!: IPontoNoSet[];

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

  public set ganhou(v: boolean) {
    this._ganhou = v ? 1 : 0;
  }

  public get setsDisputados(): number {
    return this._setsDisputados;
  }

  @Column({ nullable: true })
  resultadoCadastradoEm?: Date;

  @ManyToOne('Equipe', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;

  @ManyToOne('Partida', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_partida' })
  partida!: Partida;

  @OneToMany('AtletaEscalado', 'participacao')
  atletas!: AtletaEscalado[];
}
