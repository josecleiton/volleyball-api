import { differenceInMinutes } from 'date-fns';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
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
  static readonly estadosFinais = [StatusPartida.CONCLUIDA, StatusPartida.WO];
  static readonly maximoDeAtletasNaPartida = 14;
  static readonly quantidadeÁrbitrosPrimários = 1;
  static readonly quantidadeÁrbitrosSecundários = 1;
  static readonly quantidadeJuízesDeQuadra = 4;
  static readonly quantidadeDeÁrbitros =
    Partida.quantidadeÁrbitrosPrimários +
    Partida.quantidadeÁrbitrosSecundários +
    Partida.quantidadeJuízesDeQuadra;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  idDelegado?: string;

  @Column({ name: 'id_ginasio', type: 'uuid' })
  @Index()
  idGinasio!: string;

  public set mandante(pp: EquipePartida) {
    this._mandante = pp;
    this.idGinasio = pp.equipe.idGinasio;
    this.idMandante = pp.id;
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

  public get finalizada(): boolean {
    return Partida.estadosFinais.includes(this.status);
  }

  @ManyToOne('Delegado', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_delegado' })
  delegado?: Delegado;

  @ManyToOne('Ginasio')
  @JoinColumn({ name: 'id_ginasio' })
  ginasio!: Ginasio;

  @ManyToOne('EquipePartida', { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_ganhadora' })
  ganhadora?: EquipePartida;

  @ManyToOne('EquipePartida', {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_visitante' })
  visitante!: EquipePartida;

  @ManyToOne('EquipePartida', {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_mandante' })
  private _mandante!: EquipePartida;

  @OneToMany('ArbitroPartida', 'partida')
  arbitros?: ArbitroPartida[];
}
