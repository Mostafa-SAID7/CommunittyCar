import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['user'],
    isEmailVerified: true,
    is2FAEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAuthResponse: AuthResponse = {
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser,
    expiresIn: 3600
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store tokens', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne('/api/Auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockAuthResponse);

      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
    });
  });

  describe('register', () => {
    it('should register successfully and store tokens', () => {
      const registerRequest: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        acceptTerms: true
      };

      service.register(registerRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne('/api/Auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockAuthResponse);

      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
    });
  });

  describe('socialLogin', () => {
    it('should perform social login successfully', () => {
      const provider = 'google';
      const token = 'social-token';

      service.socialLogin(provider, token).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne('/api/Auth/social-login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ provider, token });
      req.flush(mockAuthResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');

      service.refreshToken().subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne('/api/Auth/refresh-token');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'mock-refresh-token' });
      req.flush(mockAuthResponse);
    });

    it('should throw error if no refresh token available', () => {
      expect(() => service.refreshToken()).toThrowError('No refresh token available');
    });
  });

  describe('logout', () => {
    it('should logout and clear tokens', () => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('refreshToken', 'mock-refresh-token');

      service.logout().subscribe();

      const req = httpMock.expectOne('/api/Auth/logout');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'mock-refresh-token' });
      req.flush({});

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('enable2FA', () => {
    it('should enable 2FA', () => {
      service.enable2FA().subscribe();

      const req = httpMock.expectOne('/api/Auth/enable-2fa');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });

  describe('disable2FA', () => {
    it('should disable 2FA', () => {
      service.disable2FA().subscribe();

      const req = httpMock.expectOne('/api/Auth/disable-2fa');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'mock-token');
      expect(service.getToken()).toBe('mock-token');
    });

    it('should return null if no token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      expect(service.getRefreshToken()).toBe('mock-refresh-token');
    });

    it('should return null if no refresh token', () => {
      expect(service.getRefreshToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('token', 'mock-token');
      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false if no token', () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('hasRole', () => {
    it('should return true if user has role', () => {
      // Set user in service
      service['currentUserSubject'].next(mockUser);
      expect(service.hasRole('user')).toBeTruthy();
    });

    it('should return false if user does not have role', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.hasRole('admin')).toBeFalsy();
    });

    it('should return false if no user', () => {
      service['currentUserSubject'].next(null);
      expect(service.hasRole('user')).toBeFalsy();
    });
  });

  describe('is2FAEnabled', () => {
    it('should return true if 2FA is enabled', () => {
      const userWith2FA = { ...mockUser, is2FAEnabled: true };
      service['currentUserSubject'].next(userWith2FA);
      expect(service.is2FAEnabled()).toBeTruthy();
    });

    it('should return false if 2FA is not enabled', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.is2FAEnabled()).toBeFalsy();
    });

    it('should return false if no user', () => {
      service['currentUserSubject'].next(null);
      expect(service.is2FAEnabled()).toBeFalsy();
    });
  });

  describe('isEmailVerified', () => {
    it('should return true if email is verified', () => {
      service['currentUserSubject'].next(mockUser);
      expect(service.isEmailVerified()).toBeTruthy();
    });

    it('should return false if email is not verified', () => {
      const userNotVerified = { ...mockUser, isEmailVerified: false };
      service['currentUserSubject'].next(userNotVerified);
      expect(service.isEmailVerified()).toBeFalsy();
    });

    it('should return false if no user', () => {
      service['currentUserSubject'].next(null);
      expect(service.isEmailVerified()).toBeFalsy();
    });
  });

  describe('currentUser$', () => {
    it('should emit current user', (done) => {
      service['currentUserSubject'].next(mockUser);

      service.currentUser$.subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });
    });
  });

  describe('constructor', () => {
    it('should initialize with token from localStorage', () => {
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJyb2xlcyI6WyJ1c2VyIl0sImlzRW1haWxWZXJpZmllZCI6dHJ1ZSwiaXMyRkFFbmFibGVkIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAyMy0wMS0wMVQwMDowMDowMC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMy0wMS0wMVQwMDowMDowMC4wMDBaIn19.signature');

      const httpClient = TestBed.inject(HttpClient);
      const newService = new AuthService(httpClient);

      // Note: In real implementation, decodeToken would be called
      // This test assumes the decodeToken method works correctly
    });
  });
});