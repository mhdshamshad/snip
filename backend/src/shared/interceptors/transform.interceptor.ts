import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { REDIRECT_METADATA } from '@nestjs/common/constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | T> {
    if (Reflect.getMetadata(REDIRECT_METADATA, context.getHandler())) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        let message = 'Success';
        let responseData: unknown = data;

        if (
          data &&
          typeof data === 'object' &&
          !Array.isArray(data) &&
          'message' in data &&
          typeof (data as Record<string, unknown>).message === 'string'
        ) {
          const { message: customMsg, ...rest } = data as Record<
            string,
            unknown
          >;
          message = customMsg as string;
          responseData = Object.keys(rest).length > 0 ? rest : null;
        }

        return {
          success: true,
          message,
          data: (responseData ?? null) as T,
        };
      }),
    );
  }
}
