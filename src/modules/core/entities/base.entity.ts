import {
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class EntidadeBase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @UpdateDateColumn()
  dataAtualizacao!: Date;

  @CreateDateColumn()
  @Index()
  dataCriacao!: Date;
}
