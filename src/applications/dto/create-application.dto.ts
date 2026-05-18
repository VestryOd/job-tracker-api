import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class CreateApplicationDto {
  @IsString()
  company!: string;

  @IsString()
  role!: string;

  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsISO8601()
  appliedAt!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
