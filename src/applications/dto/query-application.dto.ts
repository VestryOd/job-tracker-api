import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';
import { Type } from '@nestjs/class-transformer';

export class QueryApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;
}
