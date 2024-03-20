import {
  Body,
  Controller,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { PrismaExceptionFilter } from '../common/filters';
import { Public } from '../common/decorators';

@Controller('auth')
@Public()
@UseFilters(PrismaExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() user: SignUpDto) {
    return this.authService.signUp(user);
  }

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
