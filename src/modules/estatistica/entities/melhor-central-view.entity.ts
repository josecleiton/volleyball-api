import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Posicao } from 'src/modules/pessoa/enums';
import { Index, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { nomeMelhorCentralView } from '../estatistica.constants';

@ViewEntity({
  name: nomeMelhorCentralView,
  materialized: true,
  expression: `
    WITH ac AS (
      SELECT
        a.id AS id,
        COUNT(f.id) AS qtd,
        SUM(f.bloqueios) AS total
      FROM fundamentos_atletas AS f
      INNER JOIN atletas_escalados AS ae
      ON
        ae.id = f.id_atleta_escalado
        AND ae.posicao = '${Posicao.CENTRAL}'
      INNER JOIN atletas AS a
      ON
        a.id = ae.id_atleta
      GROUP BY a.id
    )

    SELECT
      ac.id AS id_atleta,
      ac.qtd AS quantidade_partidas,
      COALESCE(ac.total / NULLIF(ac.qtd, 0), 0) AS bloqueios_por_partida
    FROM ac
  `,
})
export class MelhorCentralView {
  @ViewColumn()
  @Index({ unique: true })
  idAtleta!: string;

  @ViewColumn()
  quantidadePartidas!: number;

  @ViewColumn()
  bloqueiosPorPartida!: number;

  @ManyToOne('Atleta')
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
