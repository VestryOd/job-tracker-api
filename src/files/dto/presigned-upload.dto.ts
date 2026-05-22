import { IsEnum, IsString } from 'class-validator';
import { FileType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PresignedUploadDto {
  @IsEnum(FileType)
  @ApiProperty()
  fileType!: FileType;

  @IsString()
  @ApiProperty()
  originalName!: string;
}
