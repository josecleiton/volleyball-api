import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column, JoinColumn, OneToOne, Unique } from 'typeorm';
import { Posicao } from '../enums';
import { Pessoa } from './pessoa.entity';

@Unique('UQ_atletas_numero_por_equipe', ['numero', 'idEquipe'])
export class Atleta extends EntidadeBase {
  @Column({ type: 'enum', enum: Posicao })
  posicao!: Posicao;

  @Column({ type: 'smallint' })
  numero!: number;

  @Column()
  idEquipe!: string;

  @OneToOne(() => Pessoa)
  @JoinColumn()
  pessoa!: Pessoa;
}
