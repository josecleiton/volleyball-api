/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function createDecorator<T = any>(
  validationFunc: (value: T) => boolean,
  name: string,
  message: string,
) {
  return (validationOptions?: ValidationOptions) => {
    return (object: Record<string, any>, propertyName: string): void =>
      registerDecorator({
        name: name,
        target: object.constructor,
        propertyName: propertyName,
        options: {
          message: message,
          ...validationOptions,
        },
        validator: {
          validate(value: any) {
            return validationFunc(value);
          },
        },
      });
  };
}
