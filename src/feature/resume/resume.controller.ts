import { Controller, Get, Inject, Put, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Result } from '../../common/interfaces/result.interface';
import { ResumeService } from './resume.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResumeDTO } from '../../common/dtos/resume.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';

@Controller('/api/resume')
@UseGuards(AuthGuard(), RolesGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  dismissDefaultMessages: true,
  validationError: {
  target: false,
  value: false,
}}))
export class ResumeController {
  constructor(
    @Inject(ResumeService) private readonly resumeServ: ResumeService,
  ) {}

  @Get()
  async getResume(): Promise<Result> {
    const res = await this.resumeServ.getResume();
    return {code: 200, message: '查询成功', data: res};
  }

  /**
   * 修改我的简历
   * @param modifyInput 修改内容
   */
  @Put()
  @Roles('admin')
  async modify(@Body() modifyInput: ResumeDTO): Promise<Result> {
    await this.resumeServ.modify(modifyInput);
    return {code: 200, message: '修改成功'};
  }
}
