import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = await this.usersService.create(
      email,
      passwordHash,
    );
    return safeUser;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isEqual = await bcrypt.compare(password, user.passwordHash);

    if (!isEqual) {
      throw new UnauthorizedException('Wrong password');
    }

    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
