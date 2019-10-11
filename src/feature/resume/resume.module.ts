import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from '../../common/entities/resume.entity';

@Module({
  imports: [
  PassportModule.register({defaultStrategy: 'jwt'}),
  TypeOrmModule.forFeature([Resume]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
