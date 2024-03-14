import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Role } from 'src/common/enums'; // Make sure to import the correct enum path

export function IsRole(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.values(Role).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Role (ADMIN or USER)`;
        },
      },
    });
  };
}
