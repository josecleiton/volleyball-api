import { EntidadeBase } from 'src/modules/core';
import { Posicao, Atleta } from 'src/modules/pessoa';
import { Entity, Unique, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { EquipePartida } from './equipe-partida.entity';

@Entity('atletas_escalados')
@Unique(['idAtleta', 'idEquipePartida'])
export class AtletaEscalado extends EntidadeBase {
  @Column('uuid')
  @Index()
  idEquipePartida!: string;

  @Column('uuid')
  @Index()
  idAtleta!: string;

  @Column({ type: 'enum', enum: Posicao })
  @Index()
  posicao!: Posicao;

  @ManyToOne('EquipePartida', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_equipe_partida' })
  participacao!: EquipePartida;

  @ManyToOne('Atleta', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
