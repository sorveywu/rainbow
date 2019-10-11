import { IsString, IsNotEmpty } from 'class-validator';

export class ResumeDTO {
  id?: number;

  @IsString()
  @IsNotEmpty()
  content: string;

}
