import { EntidadeBase } from 'src/modules/core';
import { Atleta } from 'src/modules/pessoa';
import { Entity, Unique, Index, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('votos_da_galera')
@Unique(['idAtleta', 'telefone'])
@Index(['telefone', 'verificadoEm'])
export class VotoDaGalera extends EntidadeBase {
  @Column('uuid')
  idAtleta!: string;

  @Column('varchar')
  telefone!: string;

  @Column({ type: 'varchar', unique: true, select: false })
  idVerificacao!: string;

  @Column({ nullable: true })
  verificadoEm?: Date;

  @Column()
  verificacaoExpiraEm!: Date;

  @ManyToOne('Atleta', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
