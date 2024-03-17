import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('DATABASE_URL'),
          },
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should create PrismaClient instance with correct URL', () => {
    expect(prismaService).toBeInstanceOf(PrismaService);
    expect(configService.get<string>('database.url')).toEqual('DATABASE_URL');
  });
});
