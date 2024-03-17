import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = 500;
    let message = 'Internal server error';

    // Handle the unique constraint validation error
    if (exception.code === 'P2002') {
      const modelName = exception.meta?.modelName || 'record';
      const fieldName = exception.meta?.target || 'credentials';
      status = 400;
      message = `A ${modelName} with that ${fieldName} already exists`;
    }

    // Handle the missing record error
    if (exception.code === 'P2025') {
      console.log(exception);
      if (exception.meta) {
        const modelName = exception.meta.modelName;
        message = `${modelName} to update not found`;
      } else {
        message = exception.message;
      }
      status = 400;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
