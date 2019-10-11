import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((error, caught): any => {
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
        /* return Promise.resolve({
          code: error.getStatus(),
          message: error.getResponse(),
        }); */
      }

      throw new HttpException(`出现了意外错误：${error.toString()}`, 500);

      /* return Promise.resolve({
        code: 500,
        message: `出现了意外错误：${error.toString()}`,
      }); */
    }));
  }
}
