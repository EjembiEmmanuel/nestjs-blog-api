import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = 500;
    let message = 'An error occurred';

    // Handle the unique constraint validation error
    if (exception.code === 'P2002') {
      const fieldName = exception.meta?.target || 'credentials';
      status = 400;
      message = `A record with that ${fieldName} already exists`;
    }

    // Handle the missing record error
    if (exception.code === 'P2025') {
      const recordToUpdate = exception.meta?.modelName || 'Record';
      status = 400;
      message = `${recordToUpdate} not found`;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
