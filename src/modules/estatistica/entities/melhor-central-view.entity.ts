import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Index, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { nomeMelhorCentralView } from '../estatistica.constants';
import { FundamentoAtleta } from './fundamento-atleta.entity';

@ViewEntity({
  name: nomeMelhorCentralView,
  materialized: true,
  expression: (conn) =>
    conn
      .createQueryBuilder()
      .select('a.id', 'id_atleta')
      .addSelect('COALESCE(SUM(f.bloqueios), 0)', 'bloqueios')
      .from(FundamentoAtleta, 'f')
      .innerJoin('f.atleta', 'ae')
      .innerJoin('ae.atleta', 'a')
      .groupBy('a.id')
      .orderBy('bloqueios', 'DESC'),
})
export class MelhorCentralView {
  @ViewColumn()
  @Index({ unique: true })
  idAtleta!: string;

  @ViewColumn()
  bloqueios!: number;

  @ManyToOne(() => Atleta)
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
