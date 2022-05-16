import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { TipoAuxiliar } from '../enums';
import { Pessoa } from './pessoa.entity';

export class Auxiliar extends EntidadeBase {
  @Column({ type: 'enum', enum: TipoAuxiliar })
  tipoAuxiliar!: TipoAuxiliar;

  @Column()
  idEquipe!: string;

  @OneToOne(() => Pessoa)
  @JoinColumn()
  pessoa!: Pessoa;
}
