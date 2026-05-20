import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileWithUrlType, PresignedUploadType } from './files.types';

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async getPresignedUpload(
    applicationId: string,
    userId: string,
    dto: PresignedUploadDto,
  ): Promise<PresignedUploadType> {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const s3Key = `${userId}/${applicationId}/${Date.now()}-${dto.originalName}`;

    const file = await this.prisma.applicationFile.create({
      data: {
        ...dto,
        s3Key,
        applicationId,
      },
    });

    return { url: await this.s3.getPresignedUploadUrl(s3Key), fileId: file.id };
  }

  async getFiles(
    applicationId: string,
    userId: string,
  ): Promise<FileWithUrlType[]> {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const files = await this.prisma.applicationFile.findMany({
      where: { applicationId },
    });

    return Promise.all(
      files.map(async (file) => ({
        ...file,
        downloadUrl: await this.s3.getPresignedDownloadUrl(file.s3Key),
      })),
    );
  }
}
