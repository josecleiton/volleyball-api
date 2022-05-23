import { Partida } from 'src/modules/partida/entities/partida.entity';
import { Entity, OneToMany } from 'typeorm';
import { PessoaDeLiga } from './pessoa_de_liga';

@Entity('arbitros')
export class Arbitro extends PessoaDeLiga {
  @OneToMany(() => Partida, (p) => p.arbitro)
  partidas!: Partida[];
}
