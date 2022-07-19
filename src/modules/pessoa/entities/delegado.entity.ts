import { Partida } from 'src/modules/partida';
import { Entity, OneToMany } from 'typeorm';
import { PessoaDeLiga } from './pessoa_de_liga.entity';

@Entity('delegados')
export class Delegado extends PessoaDeLiga {
  @OneToMany('Partida', 'delegado')
  partidas!: Partida[];
}
