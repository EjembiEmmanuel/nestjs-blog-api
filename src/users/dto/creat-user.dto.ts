import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums';
import { IsRole } from 'src/common/decorators';

export class CreateUserDto {
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