import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecretAccessKey: process.env.JWT_SECRET_ACCESS_KEY,
}));
