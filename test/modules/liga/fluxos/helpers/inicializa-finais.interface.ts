import { InicializaLigaRespostaDto } from 'src/modules/liga/dto/liga.dto';

export interface IInicializaFinais extends InicializaLigaRespostaDto {
  ignorarPartidas?: boolean;
}
