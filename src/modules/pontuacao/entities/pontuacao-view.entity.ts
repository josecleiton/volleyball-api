import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Index, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'pontuacoes_view',
  materialized: true,
  expression: `
    SELECT
      e.id AS id_equipe,
      SUM(ep.pontuacao) AS pontuacao,
      SUM(ep.sets_ganhos) AS sets_ganhos,
      SUM(ep.sets_disputados) AS sets_disputados,
      COUNT(ep.id) AS partidas_disputadas,
      SUM(ep.ganhou) AS partidas_ganhas,
      SUM(ep.sets_disputados) - SUM(ep.sets_ganhos) AS sets_perdidos,
      COUNT(ep.id) - SUM(ep.ganhou) AS partidas_perdidas
    FROM equipes_partidas AS ep
    INNER JOIN equipes AS e
      ON e.id = ep.id_equipe
    GROUP BY e.id
    ORDER BY pontuacao DESC
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
  partidasGanhas!: number;

  @ViewColumn()
  partidasPerdidas!: number;

  @ViewColumn()
  partidasDisputadas!: number;

  @ManyToOne(() => Equipe)
  @JoinColumn({ name: 'idEquipe' })
  equipe!: Equipe;
}
