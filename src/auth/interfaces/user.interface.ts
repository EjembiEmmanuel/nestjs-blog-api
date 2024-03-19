import { Role } from '../../common/enums';

export interface User {
  id?: number;
  email: string;
  password: string;
  name?: string;
  role?: Role;
}
