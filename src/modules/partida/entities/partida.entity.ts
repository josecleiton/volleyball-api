import { differenceInMinutes } from 'date-fns';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Ginasio } from 'src/modules/ginasio/entities/ginasio.entity';
import { Delegado } from 'src/modules/pessoa/entities/delegado.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StatusPartida } from '../enums/status-partida.enum';
import { TipoRodada, tiposDeRodada } from '../types/tipo-rodada.type';
import { ArbitroPartida } from './arbitro-partida.entity';
import { EquipePartida } from './equipe-partida.entity';

@Entity('partidas')
@Index('IX_partidas_RemovePartidasSemVencedores', ['status'], {
  where: 'id_ganhadora IS NULL',
})
@Index('IX_partidas_status_tipoDaRodada', ['status', 'tipoDaRodada'])
export class Partida extends EntidadeBase {
  static readonly minimoDeAtletasNaPartida = 12;
  static readonly maximoDeLiberos = 2;
  @Column({ type: 'uuid', nullable: true })
  @Index()
  idDelegado?: string;

  @Column({ name: 'id_ginasio', type: 'uuid' })
  @Index()
  idGinasio!: string;

  public set mandante(pp: EquipePartida) {
    this._mandante = pp;
    this.idGinasio = pp.equipe.idGinasio;
  }

  public get mandante(): EquipePartida {
    return this._mandante;
  }

  @Column({ type: 'enum', enum: tiposDeRodada })
  @Index()
  tipoDaRodada!: TipoRodada;

  @Column('uuid')
  @Index()
  idMandante!: string;

  @Column('uuid')
  @Index()
  idVisitante!: string;

  @Column({
    type: 'enum',
    enum: StatusPartida,
    default: StatusPartida.AGENDADA,
  })
  status: StatusPartida = StatusPartida.AGENDADA;

  @Column()
  dataComeco!: Date;

  @Column({ nullable: true })
  dataFinalizacao?: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  idGanhadora?: string;

  public get duracaoBruta(): number | undefined {
    if (!this.dataFinalizacao) return undefined;
    if (!this.dataComeco) return undefined;

    return differenceInMinutes(this.dataFinalizacao, this.dataComeco);
  }

  @ManyToOne(() => Delegado)
  @JoinColumn({ name: 'id_delegado' })
  delegado?: Delegado;

  @ManyToOne(() => Ginasio)
  @JoinColumn({ name: 'id_ginasio' })
  ginasio!: Ginasio;

  @ManyToOne(() => EquipePartida)
  @JoinColumn({ name: 'id_ganhadora' })
  ganhadora?: EquipePartida;

  @ManyToOne(() => Equipe, { eager: true })
  @JoinColumn({ name: 'id_visitante' })
  visitante!: EquipePartida;

  @ManyToOne(() => Equipe, { eager: true })
  @JoinColumn({ name: 'id_mandante' })
  private _mandante!: EquipePartida;

  @OneToMany(() => ArbitroPartida, (ap) => ap.partida)
  arbitros?: ArbitroPartida[];
}
