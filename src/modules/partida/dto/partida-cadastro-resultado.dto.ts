import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  Min,
} from 'class-validator';

export class CadastrarResultadoPartidaDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @Min(0, { each: true })
  setsMandante!: number[];

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @Min(0, { each: true })
  setsVisitante!: number[];
}
