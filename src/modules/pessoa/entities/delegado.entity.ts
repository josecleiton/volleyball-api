import { Partida } from 'src/modules/partida/entities/partida.entity';
import { Entity, OneToMany } from 'typeorm';
import { PessoaDeLiga } from './pessoa_de_liga.entity';

@Entity('delegados')
export class Delegado extends PessoaDeLiga {
  @OneToMany(() => Partida, (p) => p.delegado)
  partidas!: Partida[];
}
