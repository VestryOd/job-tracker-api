import { ApplicationFile } from '@prisma/client';

export type FileWithUrlType = ApplicationFile & { downloadUrl: string };

export type PresignedUploadType = { url: string; fileId: string };
