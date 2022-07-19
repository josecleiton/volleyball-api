import { Posicao, Atleta } from 'src/modules/pessoa';
import { ViewEntity, ViewColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { nomeMelhorOpostoView } from '../estatistica.constants';

@ViewEntity({
  name: nomeMelhorOpostoView,
  materialized: true,
  expression: `
    WITH ac AS (
      SELECT
        a.id AS id,
        COUNT(f.id) AS qtd,
        SUM(f.aces) AS total_aces,
        SUM(f.saques) AS total_saques,
        SUM(f.ataques) AS total_ataques,
        SUM(f.pontos) AS total_pontos
      FROM fundamentos_atletas AS f
      INNER JOIN atletas_escalados AS ae
      ON
        ae.id = f.id_atleta_escalado
        AND ae.posicao = '${Posicao.OPOSTO}'
      INNER JOIN atletas AS a
      ON
        a.id = ae.id_atleta
      GROUP BY a.id
    )

    SELECT
      ac.id AS id_atleta,
      ac.qtd AS quantidade_partidas,
      COALESCE(ac.total_pontos / NULLIF(ac.qtd, 0), 0) AS pontos_por_partida,
      COALESCE(ac.total_pontos / NULLIF(ac.total_ataques, 0), 0) AS ataques_efetivos,
      COALESCE(ac.total_aces / NULLIF(ac.qtd, 0), 0) AS aces_por_partida,
      COALESCE(ac.total_aces / NULLIF(ac.total_saques, 0), 0) AS saques_efetivos
    FROM ac
`,
})
export class MelhorOpostoView {
  @ViewColumn()
  @Index({ unique: true })
  idAtleta!: string;

  @ViewColumn()
  quantidadePartidas!: number;

  @ViewColumn()
  pontosPorPartida!: number;

  @ViewColumn()
  ataquesEfetivos!: number;

  @ViewColumn()
  acesPorPartida!: number;

  @ViewColumn()
  saquesEfetivos!: number;

  @ManyToOne('Atleta')
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
