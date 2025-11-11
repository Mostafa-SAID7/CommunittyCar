import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['hasRole']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true when user has admin role', () => {
      authServiceSpy.hasRole.and.returnValue(true);

      const result = guard.canActivate();

      expect(result).toBeTruthy();
      expect(authServiceSpy.hasRole).toHaveBeenCalledWith('admin');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should return false and navigate to dashboard when user does not have admin role', () => {
      authServiceSpy.hasRole.and.returnValue(false);

      const result = guard.canActivate();

      expect(result).toBeFalsy();
      expect(authServiceSpy.hasRole).toHaveBeenCalledWith('admin');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});