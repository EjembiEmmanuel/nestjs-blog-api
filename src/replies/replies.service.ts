import { BadRequestException, Injectable } from '@nestjs/common';
import { Reply } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RepliesService {
  constructor(private prismaService: PrismaService) {}

  async create(reply: Reply) {
    try {
      const newReply = await this.prismaService.reply.create({
        data: reply,
      });
      return newReply;
    } catch (error) {
      throw error;
    }
  }

  async update(reply: Reply) {
    try {
      const updatedReply = await this.prismaService.reply.update({
        where: { id: reply.id },
        data: reply,
      });

      return updatedReply;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const replies = await this.prismaService.reply.findMany();

    if (replies.length === 0) {
      throw new BadRequestException('Replys not found');
    }

    return replies;
  }

  async findOne(id: number) {
    try {
      const reply = await this.prismaService.reply.findUniqueOrThrow({
        where: { id: id },
      });

      return reply;
    } catch (error) {
      throw error;
    }
  }
}
