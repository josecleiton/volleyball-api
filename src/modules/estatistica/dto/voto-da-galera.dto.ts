import {
  IsUUID,
  IsPhoneNumber,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { VotoDaGalera } from '../entities';

export class IniciarVotoDto {
  @IsUUID()
  idAtleta!: string;

  @IsPhoneNumber('BR')
  telefone!: string;
}

export class ConfirmarVotoDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  token!: string;
}

export class IniciarVotoRespostaDto {
  id: string;
  idAtleta: string;
  telefone: string;

  constructor(voto: VotoDaGalera) {
    this.id = voto.id;
    this.idAtleta = voto.idAtleta;
    // TODO: mask
    this.telefone = voto.telefone;
  }
}
