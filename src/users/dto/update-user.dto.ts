import { IsString, IsEmail, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../../common/enums';
import { IsRole } from '../../common/decorators';

export class UpdateUserDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  id: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string = '';

  @IsString()
  name?: string = '';

  @IsString()
  @IsRole()
  role?: Role = Role.USER;
}
