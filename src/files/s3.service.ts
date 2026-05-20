import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly bucketName =
    process.env['S3_BUCKET_NAME'] ?? 'job-tracker-files';
  private readonly client: S3Client = new S3Client({
    region: process.env['AWS_REGION'],
    endpoint: process.env['AWS_ENDPOINT_URL'], // for LocalStack
    forcePathStyle: true, // needed for LocalStack
    credentials: {
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? 'test',
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? 'test',
    },
  });

  async onModuleInit(): Promise<void> {
    try {
      const input = {
        Bucket: this.bucketName,
      };
      const command = new CreateBucketCommand(input);
      await this.client.send(command);
    } catch (e) {
      if (e instanceof Error && e.name !== 'BucketAlreadyOwnedByYou') {
        throw e;
      }
    }
  }

  getPresignedUploadUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn: 300 });
  }

  getPresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn: 1800 });
  }
}
