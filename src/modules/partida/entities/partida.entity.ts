import { differenceInMinutes } from 'date-fns';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Ginasio } from 'src/modules/ginasio/entities/ginasio.entity';
import { Arbitro } from 'src/modules/pessoa/entities/arbitro.entity';
import { Delegado } from 'src/modules/pessoa/entities/delegado.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PartidaStatus } from '../enums/partida-status.enum';

@Entity()
export class Partida extends EntidadeBase {
  @Column('uuid')
  @Index()
  idDelegado!: string;

  @Column('uuid')
  @Index()
  idArbitro!: string;

  @Column('uuid')
  @Index()
  idGinasio!: string;

  @Column('uuid')
  @Index()
  idMandante!: string;

  @Column('uuid')
  @Index()
  idVisitante!: string;

  @Column({ type: 'enum', enum: PartidaStatus })
  status: PartidaStatus = PartidaStatus.AGENDADA;

  @Column({ nullable: true })
  dataComeco?: Date;

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
  delegado!: Delegado;

  @ManyToOne(() => Arbitro)
  @JoinColumn({ name: 'id_arbitro' })
  arbitro!: Arbitro;

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
  equipeMandante!: Equipe;
}
