import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { S3Service } from '../src/files/s3.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testEmail = `e2e-${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(S3Service)
      .useValue({
        onModuleInit: jest.fn(),
        getPresignedUploadUrl: jest.fn(),
        getPresignedDownloadUrl: jest.fn(),
      })
      .compile();

    prisma = moduleFixture.get(PrismaService);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { startsWith: 'e2e-' } } });
    await app.close();
  });

  it('POST /auth/register - returns 201 and email', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', testEmail);
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('POST /auth/register - returns 400 on invalid password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: '123' });

    expect(res.status).toBe(400);
  });
});
