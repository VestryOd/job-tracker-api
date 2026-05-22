import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @ApiProperty()
  email!: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password!: string;
}
