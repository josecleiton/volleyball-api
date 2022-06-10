import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Index, JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { nomeCraqueDaGaleraView } from '../estatistica.constants';
import { VotoDaGalera } from './voto-da-galera.entity';

@ViewEntity({
  name: nomeCraqueDaGaleraView,
  materialized: true,
  expression: (conn) =>
    conn
      .createQueryBuilder()
      .select('a.id', 'id_atleta')
      .addSelect('COUNT(vg.id)', 'quantidade_votos')
      .from(VotoDaGalera, 'vg')
      .innerJoin('vg.atleta', 'a')
      .where('vg.verificado_em IS NOT NULL')
      .groupBy('a.id'),
})
export class CraqueDaGaleraView {
  @ViewColumn()
  @Index({ unique: true })
  idAtleta!: string;

  @ViewColumn()
  quantidadeVotos!: number;

  @ManyToOne(() => Atleta)
  @JoinColumn({ name: 'id_atleta' })
  atleta!: Atleta;
}
