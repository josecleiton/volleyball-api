import { IsOptional, IsString, IsUrl, IsUUID, Length } from 'class-validator';
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

export class AtualizaEquipeDto {
  @IsOptional()
  @IsUUID()
  idGinasio!: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  nome?: string;

  @IsUrl()
  @IsOptional()
  urlBrasao?: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  cidade?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;
}

export class ListaEquipesDto {
  @IsUUID()
  idLiga!: string;
}

export class EquipeSimplificadaRespostaDto {
  id: string;
  nome: string;
  idLiga: string;
  idGinasio: string;
  quantidadeAtletas: number;

  constructor(equipe: Equipe) {
    this.id = equipe.id;
    this.nome = equipe.nome;
    this.idLiga = equipe.idLiga;
    this.idGinasio = equipe.idGinasio;
    this.quantidadeAtletas = equipe.atletas?.length ?? 0;
  }
}

export class EquipeRespostaDto extends EquipeSimplificadaRespostaDto {
  urlBrasao?: string;
  apta: boolean;
  descricaoAptidao?: string[];
  cidade: string;
  estado: string;
  tecnico?: TecnicoRespostaDto;
  quantidadeAuxiliares: number;
  atletas: AtletaRespostaDto[];
  auxiliares: AuxiliarRespostaDto[];

  constructor(equipe: Equipe) {
    super(equipe);

    this.urlBrasao = equipe.urlBrasao;
    this.apta = equipe.apta;
    this.descricaoAptidao = equipe.descricaoAptidao;
    this.cidade = equipe.cidade;
    this.estado = equipe.estado;
    this.tecnico = equipe.tecnico
      ? new TecnicoRespostaDto(equipe.tecnico)
      : undefined;
    this.quantidadeAuxiliares = equipe.auxiliares?.length ?? 0;
    this.atletas = equipe.atletas?.map((x) => new AtletaRespostaDto(x)) ?? [];
    this.auxiliares =
      equipe.auxiliares?.map((x) => new AuxiliarRespostaDto(x)) ?? [];
  }
}
