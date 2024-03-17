import { IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProfileDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  userId: number;

  @IsString()
  bio: string;
}
