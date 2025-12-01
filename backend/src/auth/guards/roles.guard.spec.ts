import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() } as unknown as Reflector;
  const guard = new RolesGuard(reflector);

  it('allows when no roles specified', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(undefined);
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['ORG_ADMIN'] } }) }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
    expect(guard.canActivate(context)).toBe(true);
  });

  it('blocks when roles mismatch', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['APPROVER']);
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['VIEWER'] } }) }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
    expect(() => guard.canActivate(context)).toThrow('Insufficient role');
  });
});
