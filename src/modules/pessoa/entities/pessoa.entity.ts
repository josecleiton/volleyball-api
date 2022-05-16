import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Genero } from 'src/modules/core/enums';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TipoPessoa } from '../enums';

@Entity()
export class Pessoa extends EntidadeBase {
  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', length: 50 })
  documento!: string;

  @Column({ type: 'enum', enum: Genero })
  genero!: Genero;

  @Column({ type: 'smallint' })
  idade!: number;

  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCbv!: string;

  @Column({ type: 'enum', enum: TipoPessoa })
  tipo!: TipoPessoa;

  @OneToOne(() => Pessoa)
  @JoinColumn()
  pessoa!: Pessoa;

  constructor(tipo?: TipoPessoa) {
    super();

    this.tipo = tipo ?? this.tipo;
  }
}
