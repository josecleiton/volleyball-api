import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class EntidadeBase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @UpdateDateColumn()
  dataAtualizacao!: Date;

  @CreateDateColumn()
  dataCriacao!: Date;
}
