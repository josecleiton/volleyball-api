import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { AtletaEscalado } from 'src/modules/partida/entities/atleta-escalado.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('fundamentos_atletas')
export class FundamentoAtleta extends EntidadeBase {
  @Column('uuid')
  @Index()
  idAtletaPartida!: string;

  @Column({ type: 'int', default: 0 })
  bloqueios!: number;

  @Column({ type: 'int', default: 0 })
  recepcoes!: number;

  @Column({ type: 'int', default: 0 })
  aces!: number;

  @Column({ type: 'int', default: 0 })
  saques!: number;

  @Column({ type: 'int', default: 0 })
  ataques!: number;

  @Column({ type: 'int', default: 0 })
  pontos!: number;

  public get mediasDeAcesPorSaque(): number {
    if (!this.saques) return 0;

    return this.aces / this.saques;
  }

  public get mediaDePontosPorAtaque(): number {
    if (!this.ataques) return 0;

    return this.pontos / this.ataques;
  }

  @ManyToOne(() => AtletaEscalado)
  @JoinColumn({ name: 'id_atleta_partida' })
  atleta!: AtletaEscalado;
}
