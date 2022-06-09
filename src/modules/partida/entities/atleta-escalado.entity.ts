import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Posicao } from 'src/modules/pessoa/enums';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
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

  @ManyToOne(() => EquipePartida)
  @JoinColumn({ name: 'id_equipe_partida' })
  participacao!: EquipePartida;

  @ManyToOne(() => Atleta)
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
