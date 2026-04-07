import { Role } from '@prisma/client';

export interface UserPayload {
  userId: string;
  companyId: string;
  role: Role;
}
