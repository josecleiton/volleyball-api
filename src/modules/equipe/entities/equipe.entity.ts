import { Liga } from 'src/modules/competicao/entities/liga.entity';
import { EntidadeBase } from 'src/modules/core/entities/base.entity';
import { Ginasio } from 'src/modules/ginasio/entities/ginasio.entity';
import { Partida } from 'src/modules/partida/entities/partida.entity';
import { Atleta } from 'src/modules/pessoa/entities/atleta.entity';
import { Tecnico } from 'src/modules/pessoa/entities/tecnico.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('equipes')
@Index('IX_equipes_cidade_estado', ['cidade', 'estado'])
export class Equipe extends EntidadeBase {
  static quantidadeAtletasPraAptidao = 12;
  static quantidadeMaximaDeAtletas = 22;

  @Column({ type: 'varchar', length: 255, unique: true })
  nome!: string;

  @Column({ nullable: true })
  urlBrasao?: string;

  @Column({ type: 'boolean', default: false })
  public get apta(): boolean {
    const descricaoAptidao = [];

    if (this.atletas.length < Equipe.quantidadeAtletasPraAptidao) {
      descricaoAptidao.push(
        `Precisa-se de ${Equipe.quantidadeAtletasPraAptidao} atletas. Atletas cadastrados: ${this.atletas.length}`,
      );
    }

    if (!this.tecnico) {
      descricaoAptidao.push('Necessita de um técnico');
    }

    this.descricaoAptidao = descricaoAptidao;

    return !descricaoAptidao.length;
  }

  @Column({ type: 'jsonb', nullable: true })
  descricaoAptidao?: string[];

  @Column({ type: 'varchar', length: 20 })
  estado!: string;

  @Column()
  cidade!: string;

  @Column('uuid')
  idLiga!: string;

  @Column('uuid')
  idGinasio!: string;

  @OneToOne(() => Tecnico, (t) => t.equipe)
  tecnico?: Tecnico;

  @OneToMany(() => Atleta, (a) => a.equipe)
  atletas!: Atleta[];

  @ManyToOne(() => Liga, (c) => c.equipes)
  @JoinColumn({ name: 'id_liga' })
  liga!: Liga;

  @OneToOne(() => Ginasio)
  @JoinColumn({ name: 'id_ginasio' })
  ginasio!: Ginasio;

  @OneToMany(() => Partida, (p) => p.equipeGanhadora)
  partidasGanhadas!: Partida[];

  @OneToMany(() => Partida, (p) => p.equipeVisitante)
  partidasVisitantes!: Partida[];

  @OneToMany(() => Partida, (p) => p.equipeMandante)
  partidasMandantes!: Partida[];
}
