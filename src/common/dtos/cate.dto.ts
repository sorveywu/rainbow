import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CateDTO {
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  sort: number = 0;

  user: any;
}
