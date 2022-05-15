import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Column } from 'typeorm';

export class Equipe extends EntidadeBase {
  @Column('tinytext')
  nome!: string;

  @Column()
  urlBrasao?: string;

  @Column()
  apta = false;

  @Column('jsonb')
  descricaoAptidao: unknown;

  @Column()
  idTecnico!: string;
}
