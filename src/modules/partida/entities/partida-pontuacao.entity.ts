import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('pontuacoes_partida')
export class PontuacaoPartida extends EntidadeBase {
  @Column({ type: 'int', default: 0 })
  mandante!: number;

  @Column({ type: 'int', default: 0 })
  visitante!: number;
}
