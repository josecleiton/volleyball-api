import { ConflictException, Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

interface ITypeORMFilterRequest {
  error: unknown;
  entityName?: string;
  description?: string;
}

@Injectable()
export class TypeORMFilterService {
  catch({
    error,
    description = '',
    entityName = 'Entidade',
  }: ITypeORMFilterRequest) {
    if (error instanceof QueryFailedError) {
      switch (error.driverError.code) {
        case '23505':
          throw new ConflictException(`${entityName}: ${description}`);
        case '23503':
          throw new ConflictException(
            `${entityName} missing some relationship. ${error.driverError.detail}`,
          );
      }
    }

    throw error;
  }
}
