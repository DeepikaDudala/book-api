import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let model: Model<User>;

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
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it(`should throw ConflictException if user already exists`, async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(model, 'create').mockRejectedValue({ code: 11000 });

      await expect(authService.signUp(mockUser.email as any)).rejects.toThrow(
        ConflictException,
      );
    });
    it(`should create a user and return token`, async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(model, 'create').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signUp(signInDto);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });

  describe('login', () => {
    it(`should throw UnauthorizedException if password doesn't match`, async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockReturnValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it(`should login user`, async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.login(loginDto);
      expect(result).toEqual({ token });
    });
    it(`should throw UnauthorizedException if user not exists`, async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
