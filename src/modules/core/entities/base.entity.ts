import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EntidadeBase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @UpdateDateColumn()
  dataAtualizacao!: Date;

  @CreateDateColumn()
  dataCriacao!: Date;
}
