import { Column, Entity, Unique } from "typeorm";
import { Posicao } from "../enums";
import { Pessoa } from "./pessoa.entity";

@Entity()
@Unique("UQ_atletas_numero_por_equipe", ['numero', 'idEquipe'])
export class Atleta extends Pessoa {
	@Column({type:'enum', enum: Posicao})
	posicao!: Posicao;
	@Column({type: 'tinyint'})
	numero!: number;
	@Column()
	idEquipe!: string;

}
