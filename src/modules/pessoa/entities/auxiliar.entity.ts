import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { TipoAuxiliar } from '../enums';
import { PessoaDeEquipe } from './pessoa_de_equipe';

export class Auxiliar extends PessoaDeEquipe {
  @Column({ type: 'enum', enum: TipoAuxiliar })
  tipoAuxiliar!: TipoAuxiliar;

  @ManyToOne(() => Equipe, (equipe) => equipe.atletas)
  @JoinColumn({ name: 'id_equipe' })
  equipe!: Equipe;
}
