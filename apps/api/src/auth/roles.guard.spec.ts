import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

function makeContext(userId: string): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user: { sub: userId } }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('allows the request through when the handler has no @Roles()', async () => {
    const reflector = { getAllAndOverride: () => undefined } as unknown as Reflector;
    const prisma = { user: { findUnique: jest.fn() } } as any;
    const guard = new RolesGuard(reflector, prisma);

    await expect(guard.canActivate(makeContext('u1'))).resolves.toBe(true);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('allows the request through when the user has a required role', async () => {
    const reflector = { getAllAndOverride: () => ['ADMIN'] } as unknown as Reflector;
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue({ role: 'ADMIN' }) },
    } as any;
    const guard = new RolesGuard(reflector, prisma);

    await expect(guard.canActivate(makeContext('u1'))).resolves.toBe(true);
  });

  it('throws ForbiddenException when the user lacks a required role', async () => {
    const reflector = { getAllAndOverride: () => ['ADMIN'] } as unknown as Reflector;
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue({ role: 'USER' }) },
    } as any;
    const guard = new RolesGuard(reflector, prisma);

    await expect(guard.canActivate(makeContext('u1'))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws ForbiddenException when the user row is missing', async () => {
    const reflector = { getAllAndOverride: () => ['ADMIN'] } as unknown as Reflector;
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue(null) },
    } as any;
    const guard = new RolesGuard(reflector, prisma);

    await expect(guard.canActivate(makeContext('u1'))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
