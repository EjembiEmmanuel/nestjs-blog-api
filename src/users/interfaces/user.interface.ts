import { Role } from 'src/common/enums';

export interface User {
  id?: number;
  email: string;
  password: string;
  name?: string;
  role?: Role;
}
