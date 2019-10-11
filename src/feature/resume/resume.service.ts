import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from '../../common/entities/resume.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume) private resumeRepo: Repository<Resume>,
  ) {}

  /**
   * 获取简历
   */
  async getResume(): Promise<any> {
    try {
      return await this.resumeRepo.findOneOrFail(1);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * 修改简历
   */
  async modify(modifyInput): Promise<any> {
    const existing = await this.getResume();
    existing.content = modifyInput.content;
    try {
      return await this.resumeRepo.save(existing);   // 保存
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }
}
