import { EntidadeBase } from 'src/modules/core';
import { Partida } from 'src/modules/partida';
import { Column, Entity, Index, OneToMany, Unique } from 'typeorm';

@Entity('ginasios')
@Index('IX_ginasios_cidade_estado', ['cidade', 'estado'])
@Unique('UQ_ginasios_nome_cidade_estado', ['nome', 'cidade', 'estado'])
export class Ginasio extends EntidadeBase {
  @Column()
  nome!: string;

  @Column()
  @Index()
  cidade!: string;

  @Column()
  @Index()
  estado!: string;

  @Column({ default: 1000 })
  capacidade!: number;

  @OneToMany('Partida', 'ginasio')
  partidas!: Partida[];
}
