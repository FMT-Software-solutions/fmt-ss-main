import { Role } from '.';
import { User } from './user';

export interface Member {
  id: string;
  role: Role;
  created_at: string;
  user: User;
}
