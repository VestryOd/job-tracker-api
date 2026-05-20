import { IsEnum, IsString } from 'class-validator';
import { FileType } from '@prisma/client';

export class PresignedUploadDto {
  @IsEnum(FileType)
  fileType!: FileType;

  @IsString()
  originalName!: string;
}
