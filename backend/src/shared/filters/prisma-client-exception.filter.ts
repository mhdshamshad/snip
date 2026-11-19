import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong. Please try again later.';
    let error = 'Internal Server Error';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        message = 'This information is already in use.';
        error = 'Conflict';
        break;
      }

      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'The requested resource was not found.';
        error = 'Not Found';
        break;
      }

      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        message =
          'This operation cannot be completed because related data is unavailable.';
        error = 'Bad Request';
        break;
      }

      default:
        break;
    }

    this.logger.error(
      `Prisma error [${exception.code}] on ${request.method} ${request.url}: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
