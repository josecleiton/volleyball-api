import { Posicao, Atleta } from 'src/modules/pessoa';
import { ViewEntity, ViewColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { nomeMelhorLiberoView } from '../estatistica.constants';

@ViewEntity({
  name: nomeMelhorLiberoView,
  materialized: true,
  expression: `
    WITH ac AS (
      SELECT
        a.id AS id,
        COUNT(f.id) AS qtd,
        SUM(f.recepcoes) AS total
      FROM fundamentos_atletas AS f
      INNER JOIN atletas_escalados AS ae
      ON
        ae.id = f.id_atleta_escalado
        AND ae.posicao = '${Posicao.LIBERO}'
      INNER JOIN atletas AS a
      ON
        a.id = ae.id_atleta
      GROUP BY a.id
    )

    SELECT
      ac.id AS id_atleta,
      ac.qtd AS quantidade_partidas,
      COALESCE(ac.total / NULLIF(ac.qtd, 0), 0) AS recepcoes_por_partida
    FROM ac
`,
})
export class MelhorLiberoView {
  @ViewColumn()
  @Index({ unique: true })
  idAtleta!: string;

  @ViewColumn()
  quantidadePartidas!: number;

  @ViewColumn()
  recepcoesPorPartida!: number;

  @ManyToOne('Atleta')
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
