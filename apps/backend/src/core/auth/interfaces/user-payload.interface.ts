import { Role } from '@prisma/client';

export interface UserPayload {
  userId: string;
  companyId: string;
  teamId: string | null;
  role: Role;
  email: string;
}
