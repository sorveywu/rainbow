import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class TypeDTO {
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  sort: number = 0;
}
