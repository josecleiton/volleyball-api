import { Index, ViewColumn, ViewEntity } from 'typeorm';
import { nomeMelhorLiberoView } from '../estatistica.constants';
import { FundamentoAtleta } from './fundamento-atleta.entity';

@ViewEntity({
  name: nomeMelhorLiberoView,
  materialized: true,
  expression: (conn) =>
    conn
      .createQueryBuilder()
      .select('a.id', 'id_atleta')
      .addSelect('count(f.recepcoes)', 'recepcoes')
      .from(FundamentoAtleta, 'f')
      .innerJoin('f.atleta', 'a')
      .groupBy('a.id')
      .orderBy('recepcoes', 'DESC'),
})
export class MelhorLiberoView {
  @ViewColumn()
  @Index({ unique: true })
  idAtleta!: string;

  @ViewColumn()
  recepcoes!: number;
}