import { EntidadeBase } from 'src/modules/core';
import { OneToOne, JoinColumn, Column } from 'typeorm';
import { Pessoa } from './pessoa.entity';

export abstract class TemPessoa extends EntidadeBase {
  @OneToOne('Pessoa', { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa!: Pessoa;

  @Column({ type: 'uuid', unique: true })
  idPessoa!: string;
}
