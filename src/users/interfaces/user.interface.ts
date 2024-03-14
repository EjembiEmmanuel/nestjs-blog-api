import { Role } from 'src/common/enums';

export interface User {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}
