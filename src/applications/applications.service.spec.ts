import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationsService } from './applications.service';
import { NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';

const mockPrisma = {
  application: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ApplicationsService', () => {
  let applicationsService: ApplicationsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    applicationsService = module.get(ApplicationsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw NotFoundException when findFirst returns null', async () => {
    mockPrisma.application.findFirst.mockResolvedValue(null);
    await expect(applicationsService.findOne('1', '1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should call prisma.application.create on create with correct data', async () => {
    const mockApplicationDto = {
      company: 'Some Company',
      role: 'dev',
      status: 'applied',
      appliedAt: '2026-05-21T00:00:00.000Z',
    } as CreateApplicationDto;
    await applicationsService.create('1', mockApplicationDto);

    expect(mockPrisma.application.create).toHaveBeenCalled();
    expect(mockPrisma.application.create).toHaveBeenCalledWith({
      data: {
        ...mockApplicationDto,
        userId: '1',
        appliedAt: new Date(mockApplicationDto.appliedAt),
      },
    });
  });

  it('should throw NotFoundException when no application was found', async () => {
    await expect(applicationsService.remove('1', '1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
