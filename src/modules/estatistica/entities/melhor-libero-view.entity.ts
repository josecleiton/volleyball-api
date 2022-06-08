import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Index, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { nomeMelhorLiberoView } from '../estatistica.constants';
import { FundamentoAtleta } from './fundamento-atleta.entity';

@ViewEntity({
  name: nomeMelhorLiberoView,
  materialized: true,
  expression: (conn) =>
    conn
      .createQueryBuilder()
      .select('a.id', 'id_atleta')
      .addSelect('coalesce(sum(f.recepcoes), 0)', 'recepcoes')
      .from(FundamentoAtleta, 'f')
      .innerJoin('f.atleta', 'ae')
      .innerJoin('ae.atleta', 'a')
      .groupBy('a.id')
      .orderBy('recepcoes', 'DESC'),
})
export class MelhorLiberoView {
  @ViewColumn()
  @Index({ unique: true })
  idAtleta!: string;

  @ViewColumn()
  recepcoes!: number;

  @ManyToOne(() => Atleta)
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
