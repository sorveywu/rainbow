import { NestFactory } from '@nestjs/core';
import * as serveStatic from 'serve-static';
import { AppModule } from './app.module';
import {join} from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 使用serve-static
  // '/public' 是路由名称，即你访问的路径为：host/public
  // serveStatic 为 serve-static 导入的中间件，其中'../public' 为本项目相对于src目录的绝对地址
  app.use('/uploads', serveStatic(join(__dirname, '../public/uploads'), {
    maxAge: '1d',
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  }));

  await app.startAllMicroservicesAsync();
  app.use(cors());
  await app.listen(3000);
}
bootstrap();
