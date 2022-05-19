import { differenceInYears } from 'date-fns';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Genero } from 'src/modules/core/enums';
import { Column, Entity } from 'typeorm';
import { TipoPessoa } from '../enums';

@Entity('pessoas')
export class Pessoa extends EntidadeBase {
  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', length: 50 })
  // TODO: uma pessoa pode ser tecnico/atleta/auxiliar em uma mesma competição?
  documento!: string;

  @Column({ type: 'enum', enum: Genero })
  genero!: Genero;

  @Column()
  dataNascimento!: Date;

  @Column({ unique: true, type: 'varchar', length: 50 })
  documentoCbv!: string;

  @Column({ type: 'enum', enum: TipoPessoa })
  tipo!: TipoPessoa;

  public get idade(): number {
    return differenceInYears(new Date(), this.dataNascimento);
  }

  constructor(tipo?: TipoPessoa) {
    super();

    this.tipo = tipo ?? this.tipo;
  }
}
