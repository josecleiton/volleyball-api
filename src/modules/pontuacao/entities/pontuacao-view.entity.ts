import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { tiposDeRodadaClassificatoria } from 'src/modules/partida/types/tipo-rodada.type';
import { Index, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { nomePontuacaoView } from '../pontuacao.constant';

const tiposDeRodadaClassificatoriaJoin = tiposDeRodadaClassificatoria
  .map((x) => `'${x}'`)
  .join(', ');
@ViewEntity({
  name: nomePontuacaoView,
  materialized: true,
  expression: `
    WITH total_pontos_ep AS (
      SELECT 
        ep.id AS id,
        COALESCE(SUM((value->>'quantidade')::int),0) as total_pontos
      FROM equipes_partidas AS ep
      INNER JOIN partidas AS p
      ON
        p.id = ep.id_partida
        AND p.tipo_da_rodada IN (${tiposDeRodadaClassificatoriaJoin})
      CROSS JOIN LATERAL jsonb_array_elements(pontos_nos_sets)
      GROUP BY ep.id
    ),
    partidas_disputadas AS (
      SELECT
        ep.id_equipe AS id,
        COUNT(p.id) AS qtd,
        SUM(ep.ganhou) AS ganhou
      FROM equipes_partidas AS ep
      INNER JOIN partidas AS p
      ON
        p.id = ep.id_partida
        AND p.status IN ('${StatusPartida.WO}', '${StatusPartida.CONCLUIDA}')
      GROUP BY ep.id_equipe
    )
    
    SELECT
      e.id AS id_equipe,
      SUM(ep.pontuacao) AS pontuacao,
      SUM(ep.sets_ganhos) AS sets_ganhos,
      SUM(ep.sets_disputados) AS sets_disputados,
      COALESCE(pd.qtd, 0) AS partidas_disputadas,
      COALESCE(pd.ganhou, 0) AS partidas_ganhas,
      SUM(ep.sets_disputados) - SUM(ep.sets_ganhos) AS sets_perdidos,
      COALESCE(pd.qtd, 0) - COALESCE(pd.ganhou, 0) AS partidas_perdidas,
      COALESCE(SUM(total_pontos_ep.total_pontos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS pontos_average,
      COALESCE(SUM(ep.sets_ganhos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS sets_average
    FROM equipes AS e
    INNER JOIN equipes_partidas AS ep
      ON ep.id_equipe = e.id
    LEFT JOIN total_pontos_ep
      ON total_pontos_ep.id = ep.id
    LEFT JOIN partidas_disputadas AS pd
      ON pd.id = e.id
    GROUP BY e.id, pd.qtd, pd.ganhou
  `,
})
export class PontuacaoView {
  @ViewColumn()
  @Index({ unique: true })
  idEquipe!: string;

  @ViewColumn()
  @Index()
  pontuacao!: string;

  @ViewColumn()
  setsGanhos!: string;

  @ViewColumn()
  setsDisputados!: string;

  @ViewColumn()
  setsPerdidos!: string;

  @ViewColumn()
  pontosAverage!: string;

  @ViewColumn()
  setsAverage!: string;

  @ViewColumn()
  partidasGanhas!: string;

  @ViewColumn()
  partidasPerdidas!: string;

  @ViewColumn()
  partidasDisputadas!: string;

  @ManyToOne('Equipe')
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
