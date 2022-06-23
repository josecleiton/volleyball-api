/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValid, parse } from 'date-fns';
import { createDecorator } from './helpers/create-decoration.helper';

function validate(value: any) {
  if (typeof value !== 'string') {
    return false;
  }

  return isValid(validTimeStringToDate(value));
}

export function validTimeStringToDate(value: string) {
  return parse(value, 'HH:mm', new Date(0));
}

export const IsTimeString = createDecorator(
  validate,
  'isTimeString',
  '$property must be a valid time string -> HH:mm',
);
