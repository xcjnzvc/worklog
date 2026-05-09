import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesGuard } from '../../core/guards/roles.guard';

export const ROLES_KEY = 'roles';

const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const UseRole = (...roles: Role[]) =>
  applyDecorators(UseGuards(RolesGuard), Roles(...roles));
