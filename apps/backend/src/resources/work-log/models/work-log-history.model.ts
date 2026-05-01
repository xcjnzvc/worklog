import { WorkLogHistory as PrismaWorkLogHistory } from '@prisma/client';
import { Property } from 'ts-deco';

export class WorkLogHistory implements PrismaWorkLogHistory {
  @Property({ type: 'string' })
  id: string;

  @Property({ type: 'string' })
  userId: string;

  @Property({ type: 'string' })
  companyId: string;

  @Property({ type: 'date' })
  targetDate: Date;

  @Property({ type: 'string' })
  reason: string;

  @Property({ type: 'date', nullable: true })
  requestedClockIn: Date | null;

  @Property({ type: 'date', nullable: true })
  requestedClockOut: Date | null;

  @Property({ type: 'date' })
  createdAt: Date;
}
