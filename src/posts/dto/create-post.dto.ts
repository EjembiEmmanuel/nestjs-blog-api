import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content?: string = '';

  @IsBoolean()
  published?: boolean = false;

  @Transform(({ value }) => Number(value))
  @IsInt()
  authorId: number;
}
