import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../common/entities/project.entity';
import { TypeModule } from '../type/type.module';

@Module({
  imports: [
    TypeModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
