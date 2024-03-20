import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from 'config/database.config';
import authConfig from 'config/auth.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
      load: [databaseConfig, authConfig],
    }),
    PrismaModule,
    UsersModule,
    ProfileModule,
    AuthModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
