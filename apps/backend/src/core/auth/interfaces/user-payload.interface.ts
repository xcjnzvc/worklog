import { Role } from '@prisma/client';

export interface UserPayload {
  sub: string;
  userId: string;
  companyId: string;
  companyName: string;
  name: string;
  teamId: string | null;
  role: Role;
  email: string;
}
