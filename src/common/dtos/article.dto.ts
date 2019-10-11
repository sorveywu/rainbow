import { IsString, IsNotEmpty, MaxLength, IsNumber, IsArray } from 'class-validator';

export class ArticleDTO {
  @IsString({
    message: '标题不能为数值',
  })
  @IsNotEmpty({
    message: '标题字数过长',
  })
  @MaxLength(30, {
    message: '标题字数过长',
  })
  readonly title: string;

  @IsString()
  @MaxLength(50)
  readonly picture?: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  readonly description: string;

  @IsNumber()
  @IsNotEmpty({
    message: '文章分类不能为空',
  })
  readonly cateId: number;

  @IsArray()
  readonly tagsId: number[] = [];

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  onlineAt?: any = new Date();

  @IsNumber()
  readonly sort: number = 0;

  // 授权用户
  user: any;

  categoryUser: any;
}
