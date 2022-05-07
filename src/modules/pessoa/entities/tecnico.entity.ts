import { Column } from "typeorm";
import { Pessoa } from "./pessoa.entity";

export class Tecnico extends Pessoa {
	@Column({unique: true})
	documentoCref!: string; // documento do conselho de educação fisica
	@Column()
	idEquipe!: string;
}
