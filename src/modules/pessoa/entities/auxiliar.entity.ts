import { Column } from "typeorm";
import { TipoAuxiliar } from "../enums";
import { Pessoa } from "./pessoa.entity";

export class Auxiliar extends Pessoa {
	@Column({type: 'enum', enum: TipoAuxiliar})
	tipoAuxiliar!: TipoAuxiliar;
	@Column()
	idEquipe!: string;
}
