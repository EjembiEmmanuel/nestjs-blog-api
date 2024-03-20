import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  commentId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  authorId: number;
}
