import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from 'class-validator';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { AuxiliarRespostaDto } from 'src/modules/pessoa/dto/auxiliar.dto';
import { TecnicoRespostaDto } from 'src/modules/pessoa/dto/tecnico.dto';
import { Equipe } from '../entities/equipe.entity';

export class CriaEquipeDto {
  @IsUUID()
  idLiga!: string;

  @IsUUID()
  idGinasio!: string;

  @IsString()
  @Length(2, 200)
  nome!: string;

  @IsUrl()
  @IsOptional()
  urlBrasao?: string;

  @IsString()
  @Length(2, 200)
  cidade!: string;

  @IsString()
  @Length(2, 2)
  estado!: string;
}

export class AtualizaEquipeDto extends PartialType(CriaEquipeDto) {}

export class ListaEquipesDto {
  @IsUUID()
  idLiga!: string;
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  ids?: string[];
}

export class EquipeRespostaDto {
  id: string;
  nome: string;
  urlBrasao?: string;
  apta: boolean;
  descricaoAptidao?: string[];
  cidade: string;
  estado: string;
  idLiga: string;
  idGinasio: string;
  tecnico?: TecnicoRespostaDto;
  quantidadeAtletas: number;
  quantidadeAuxiliares: number;
  atletas: AtletaRespostaDto[];
  auxiliares: AuxiliarRespostaDto[];
  

  constructor(equipe: Equipe) {
    this.id = equipe.id;
    this.nome = equipe.nome;
    this.urlBrasao = equipe.urlBrasao;
    this.apta = equipe.apta
    this.descricaoAptidao = equipe.descricaoAptidao;
    this.cidade = equipe.cidade;
    this.estado = equipe.estado;
    this.idLiga = equipe.idLiga;
    this.idGinasio = equipe.idGinasio;
    this.quantidadeAtletas = equipe.atletas?.length ?? 0;
    this.tecnico = equipe.tecnico
      ? new TecnicoRespostaDto(equipe.tecnico)
      : undefined;
    this.quantidadeAuxiliares = equipe.auxiliares?.length ?? 0;
    this.atletas = equipe.atletas?.map((x) => new AtletaRespostaDto(x)) ?? [];
    this.auxiliares =
      equipe.auxiliares?.map((x) => new AuxiliarRespostaDto(x)) ?? [];
  }
}
