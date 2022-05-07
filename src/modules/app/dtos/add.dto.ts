import { IsNumber } from 'class-validator';

export class AddDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

