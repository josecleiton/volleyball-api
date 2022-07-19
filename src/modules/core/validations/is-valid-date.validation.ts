import { isValid } from 'date-fns';
import { createDecorator } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(value: any) {
  if (typeof value !== 'object' && typeof value !== 'number') {
    return false;
  }

  return isValid(value);
}

export const IsValidDate = createDecorator(
  validate,
  'isValidDate',
  '$property must be a valid date',
);
