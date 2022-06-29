import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsUUID } from "class-validator";
import { EquipePartida } from "../entities/equipe-partida.entity";
import { IPontoNoSet } from "../interfaces/ponto_no_set.interface";


export interface CadastrarResultadoPartidaDto {
    equipeA: EquipeResultadoPartidaDto
    equipeB: EquipeResultadoPartidaDto
}



export class EquipeResultadoPartidaDto {

    @IsUUID()
    idEquipe!: string;
   
    @IsArray()
    @ArrayMinSize(3)
    @ArrayMaxSize(5)
    pontos_nos_sets!: number[];

    @IsBoolean()
    wo!: boolean;
}



export class  CadastrarResultadoPartidaRespostaDTO{
    equipeA: EquipePartida
    equipeB: EquipePartida

    constructor(equipeA: EquipePartida, equipeB: EquipePartida ){
        this.equipeA = equipeA; 
        this.equipeB = equipeB; 
}
}


export class  EquipePartidaRespostaDto{
    
    id_equipe: string;
    id_partida?:string;
    pontuacao: number;
    sets_ganhos: number;
    pontos_nos_sets : IPontoNoSet[];
    sets_disputados:  number;
    ganhou: number;
    resultado_cadastrado_em ?: Date 

    constructor(e: EquipePartida){
      this.id_equipe  = e.idEquipe;
      this.id_partida = e.idPartida;
      this.sets_disputados = e.setsDisputados;
      this.pontuacao = e.pontuacao;
      this.sets_ganhos = e.setsGanhos;
      this.pontos_nos_sets = e.pontosNosSets;
      this.ganhou = Number(e.ganhou);
      this.resultado_cadastrado_em = e.resultadoCadastradoEm;

    }
}