import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async create(post: Post) {
    try {
      const newPost = await this.prismaService.post.create({
        data: post,
      });
      return newPost;
    } catch (error) {
      throw error;
    }
  }

  async update(post: Post) {
    try {
      const updatedPost = await this.prismaService.post.update({
        where: { id: post.id },
        data: post,
      });

      return updatedPost;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const posts = await this.prismaService.post.findMany();

    if (posts.length === 0) {
      throw new BadRequestException('Posts not found');
    }

    return posts;
  }

  async findOne(id: number) {
    try {
      const post = await this.prismaService.post.findUniqueOrThrow({
        where: { id: id },
      });

      return post;
    } catch (error) {
      throw error;
    }
  }
}
