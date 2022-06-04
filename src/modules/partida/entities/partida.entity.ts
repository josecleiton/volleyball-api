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
  OneToOne,
} from 'typeorm';
import { PartidaStatus } from '../enums/partida-status.enum';
import { ArbitroPartida } from './arbitro-partida.entity';
import { AtletaPartida } from './atleta-partida.entity';
import { PontuacaoPartida } from './partida-pontuacao.entity';

@Entity('partidas')
export class Partida extends EntidadeBase {
  static readonly minimoDeAtletasNaPartida = 12;
  static readonly maximoDeLiberos = 2;
  @Column({ type: 'uuid', nullable: true })
  @Index()
  idDelegado?: string;

  @Column({ name: 'id_ginasio', type: 'uuid' })
  @Index()
  idGinasio!: string;

  public set equipeMandante(e: Equipe) {
    this._equipeMandante = e;
    this.idGinasio = e.idGinasio;
  }

  public get equipeMandante(): Equipe {
    return this._equipeMandante;
  }

  @Column()
  @Index()
  tipoDaRodada!: string;

  @Column('uuid')
  @Index()
  idMandante!: string;

  @Column('uuid')
  @Index()
  idVisitante!: string;

  @Column({
    type: 'enum',
    enum: PartidaStatus,
    default: PartidaStatus.AGENDADA,
  })
  status: PartidaStatus = PartidaStatus.AGENDADA;

  @Column()
  dataComeco!: Date;

  @Column({ nullable: true })
  dataFinalizacao?: Date;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  idEquipeGanhador?: string;

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

  @ManyToOne(() => Equipe)
  @JoinColumn({ name: 'id_equipe_ganhador' })
  equipeGanhadora?: Equipe;

  @ManyToOne(() => Equipe)
  @JoinColumn({ name: 'id_equipe_visitante' })
  equipeVisitante!: Equipe;

  @ManyToOne(() => Equipe)
  @JoinColumn({ name: 'id_equipe_mandante' })
  private _equipeMandante!: Equipe;

  atletasMandante?: AtletaPartida[];
  atletasVisitante?: AtletaPartida[];

  @OneToMany(() => ArbitroPartida, (ap) => ap.partida)
  arbitros?: ArbitroPartida[];

  @OneToOne(() => PontuacaoPartida)
  @JoinColumn({ name: 'id' })
  pontuacao!: PontuacaoPartida;
}
