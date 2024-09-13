import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException) // Catch exceptions of type HttpException
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  // Method to catch and process the exception
  catch(exception: HttpException, host: ArgumentsHost) {
    GqlArgumentsHost.create(host); // Create GraphQL arguments host

    const status = exception.getStatus(); // Get the HTTP status of the exception
    const exceptionResponse = exception.getResponse(); // Get the exception response
    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message;

    this.logger.error(`Error ${status}: ${errorMessage}`); // Log the error with status and message

    // Return a formatted GraphQL error
    return new GraphQLError(errorMessage, {
      extensions: {
        code: status,
        timestamp: new Date().toISOString(),
        details: exceptionResponse,
      },
    });
  }
}
