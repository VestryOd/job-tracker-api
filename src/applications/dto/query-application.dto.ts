import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';
import { Type } from '@nestjs/class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  @ApiProperty()
  status?: ApplicationStatus;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  @ApiPropertyOptional()
  page?: number;
}
