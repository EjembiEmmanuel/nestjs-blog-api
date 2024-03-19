import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../common/enums';
import { IsRole } from '../../common/decorators';

export class SignUpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  name?: string = '';

  @IsString()
  @IsRole()
  role?: Role = Role.USER;
}
