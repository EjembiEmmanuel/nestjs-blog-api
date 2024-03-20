import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  postId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  authorId: number;
}
