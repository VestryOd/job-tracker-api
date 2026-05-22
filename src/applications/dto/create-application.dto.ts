import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @IsString()
  @ApiProperty()
  company!: string;

  @IsString()
  @ApiProperty()
  role!: string;

  @IsEnum(ApplicationStatus)
  @ApiProperty()
  status!: ApplicationStatus;

  @IsISO8601()
  @ApiProperty()
  appliedAt!: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional()
  notes?: string;
}
