import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Posicao } from 'src/modules/pessoa/enums';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Partida } from './partida.entity';

@Entity('atletas_partida')
@Unique(['idAtleta', 'idPartida'])
export class AtletaPartida extends EntidadeBase {
  @Column('uuid')
  @Index()
  idPartida!: string;

  @Column('uuid')
  @Index()
  idAtleta!: string;

  @Column({ type: 'enum', enum: Posicao })
  posicao!: Posicao;

  @ManyToOne(() => Partida)
  @JoinColumn({ name: 'id_partida' })
  partida!: Partida;

  @ManyToOne(() => Atleta)
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
