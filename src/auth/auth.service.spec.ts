import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('test-token') },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw ConflictException if user already exists', async () => {
    usersService.findByEmail.mockResolvedValue({ id: '1' } as User);
    await expect(authService.register('a@b.com', 'pass')).rejects.toThrow(
      ConflictException,
    );
  });

  it('should create a new user if is given email is free', async () => {
    usersService.create.mockResolvedValue({
      passwordHash: '1',
      email: 'a@b.com',
    } as User);
    const user = await authService.register('a@b.com', 'pass');
    expect(user).toBeDefined();
    expect(user).toHaveProperty('email');
    expect(user).not.toHaveProperty('passwordHash');
    expect(usersService.create).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if no user was found', async () => {
    await expect(authService.login('a@b.com', 'pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
