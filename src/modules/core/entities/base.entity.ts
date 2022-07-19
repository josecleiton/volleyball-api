import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
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
