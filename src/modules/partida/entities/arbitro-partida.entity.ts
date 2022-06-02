import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Arbitro } from 'src/modules/pessoa/entities/arbitro.entity';
import { TipoArbitro } from 'src/modules/pessoa/enums';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Partida } from './partida.entity';

@Entity('arbitros_partida')
@Unique(['idArbitro', 'idPartida'])
export class ArbitroPartida extends EntidadeBase {
  @Column('uuid')
  @Index()
  idArbitro!: string;

  @Column('uuid')
  @Index()
  idPartida!: string;

  @Column({ type: 'enum', enum: TipoArbitro })
  tipo!: TipoArbitro;

  @ManyToOne(() => Arbitro)
  @JoinColumn({ name: 'id_arbitro' })
  arbitro!: Arbitro;

  @ManyToOne(() => Partida)
  @JoinColumn({ name: 'id_partida' })
  partida!: Partida;
}
