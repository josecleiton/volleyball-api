import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class EntidadeBase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @UpdateDateColumn()
  dataAtualizacao!: Date;

  @CreateDateColumn()
  dataCriacao!: Date;
}
