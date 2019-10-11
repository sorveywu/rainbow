import { IsString, IsNotEmpty, MaxLength, IsDate, IsNumber, Max, Min, IsBoolean } from 'class-validator';

export class ProjectDTO {
  @IsString({
    message: '项目名称必须是字符串',
  })
  @IsNotEmpty({
    message: '项目名称不能为空',
  })
  @MaxLength(30, {
    message: '标题字数过长',
  })
  readonly name: string;

  @IsNumber()
  @IsNotEmpty({
    message: '文章分类不能为空',
  })
  readonly typeId: number;

  @IsString()
  @MaxLength(50)
  readonly picture?: string = '';

  @IsString()
  @MaxLength(50)
  link: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  description: string;

  @IsString()
  content: string = '';

  /**
   * TODO: 这里没有限制前端的时间格式
   */
  /* @IsDate({
    message: '时间格式不正确',
  }) */
  onlineAt: any = new Date();

  @IsBoolean()
  isTop?: boolean = false;

  @IsBoolean()
  isNew?: boolean = false;

  // 排序
  @IsNumber()
  @Max(100, {
    message: '排序不能超过100',
  })
  @Min(-1, {
    message: '排序不能小于-1',
  })
  sort: number = 0;
}
