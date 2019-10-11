import { IsString, IsNotEmpty } from 'class-validator';

export class TagDTO {
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  user: any;
}
