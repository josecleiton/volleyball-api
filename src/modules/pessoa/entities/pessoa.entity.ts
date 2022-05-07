import { Genero } from "src/modules/core/enums";
import { Column,} from "typeorm";
import { TipoPessoa } from "../enums";

export class Pessoa {
	@Column({type: 'text', length: 300})
	nome!: string;

	@Column({type: 'tinytext'})
	documento!: string;

	@Column({type: 'enum', enum: Genero})
	genero!: Genero;

	@Column({type: 'tinyint'})
	idade!: number;

	@Column({unique: true})
	documentoCbv!: string;

	@Column({type: 'enum', enum: TipoPessoa})
	tipo!: TipoPessoa;
}
