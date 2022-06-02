import { ArbitroPartida } from 'src/modules/partida/entities/arbitro-partida.entity';
import { Entity, OneToMany } from 'typeorm';
import { PessoaDeLiga } from './pessoa_de_liga';

@Entity('arbitros')
export class Arbitro extends PessoaDeLiga {
  @OneToMany(() => ArbitroPartida, (p) => p.arbitro)
  participacoesEmPartida!: ArbitroPartida[];
}
