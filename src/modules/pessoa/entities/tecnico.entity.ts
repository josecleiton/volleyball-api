import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column } from 'typeorm';
import { Pessoa } from './pessoa.entity';

export class Tecnico extends EntidadeBase {
  @Column({ unique: true })
  documentoCref!: string; // documento do conselho de educação fisica
  @Column()
  idEquipe!: string;
  @Column(() => Pessoa)
  pessoa!: Pessoa;
}
