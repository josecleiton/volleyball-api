import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Index, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'pontuacoes_view',
  materialized: true,
  expression: `
    WITH total_pontos_ep AS (
      SELECT 
        id,
        COALESCE(SUM((value->>'quantidade')::int),0) as total_pontos
      FROM equipes_partidas
      CROSS JOIN LATERAL jsonb_array_elements(pontos_nos_sets)
      GROUP BY id
    )
    
    SELECT
      e.id AS id_equipe,
      SUM(ep.pontuacao) AS pontuacao,
      SUM(ep.sets_ganhos) AS sets_ganhos,
      SUM(ep.sets_disputados) AS sets_disputados,
      COUNT(ep.id) AS partidas_disputadas,
      SUM(ep.ganhou) AS partidas_ganhas,
      SUM(ep.sets_disputados) - SUM(ep.sets_ganhos) AS sets_perdidos,
      COUNT(ep.id) - SUM(ep.ganhou) AS partidas_perdidas,
      COALESCE(SUM(total_pontos_ep.total_pontos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS pontos_average,
      COALESCE(SUM(ep.sets_ganhos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS sets_average
    FROM equipes_partidas AS ep
    INNER JOIN total_pontos_ep
      ON total_pontos_ep.id = ep.id
    INNER JOIN equipes AS e
      ON e.id = ep.id_equipe
    GROUP BY e.id
    ORDER BY pontuacao DESC;
  `,
})
export class PontuacaoView {
  @ViewColumn()
  @Index({ unique: true })
  idEquipe!: string;

  @ViewColumn()
  @Index()
  pontuacao!: number;

  @ViewColumn()
  setsGanhos!: number;

  @ViewColumn()
  setsDisputados!: number;

  @ViewColumn()
  setsPerdidos!: number;

  @ViewColumn()
  pontosAverage!: number;

  @ViewColumn()
  setsAverage!: number;

  @ViewColumn()
  partidasGanhas!: number;

  @ViewColumn()
  partidasPerdidas!: number;

  @ViewColumn()
  partidasDisputadas!: number;

  @ManyToOne(() => Equipe)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
