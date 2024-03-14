import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums';

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
  role?: Role = Role.USER;
}
