import { EntidadeBase } from 'src/modules/core';
import { TipoArbitro, Arbitro } from 'src/modules/pessoa';
import { Entity, Unique, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
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

  @ManyToOne('Arbitro', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_arbitro' })
  arbitro!: Arbitro;

  @ManyToOne('Partida', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_partida' })
  partida!: Partida;
}
