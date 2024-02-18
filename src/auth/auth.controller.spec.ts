import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockUser = {
    _id: '65cf58c6753e980a90ab1c65',
    name: 'sahi',
    email: 'sahisu@gmail.com',
    password: '12345',
  };
  let signInDto = {
    name: 'sahi',
    email: 'sahisu@gmail.com',
    password: '12345',
  };
  let loginDto = {
    email: 'sahisu@gmail.com',
    password: '12345',
  };
  let token = 'jwtToken';
  const mockAuthService = {
    signUp: jest.fn().mockResolvedValue({ token }),
    login: jest.fn().mockResolvedValue({ token }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });
  it('should be defined', async () => {
    expect(authController).toBeDefined();
  });
  describe('signup', () => {
    it('should signup a user', async () => {
      const result = await authController.signUp(signInDto);
      expect(authService.signUp).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });
  describe('login', () => {
    it('should login user', async () => {
      const result = await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });
});
