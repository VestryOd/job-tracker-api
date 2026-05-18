import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationDto } from './dto/query-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, query: QueryApplicationDto) {
    const page = query.page ?? 1;
    return this.prisma.application.findMany({
      where: { userId, status: query.status },
      skip: (page - 1) * 10,
      take: 10,
    });
  }

  create(userId: string, dto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: { ...dto, userId, appliedAt: new Date(dto.appliedAt) },
    });
  }

  async findOne(userId: string, id: string) {
    const application = await this.prisma.application.findFirst({
      where: { userId, id },
    });

    if (!application) {
      throw new NotFoundException('Not found application');
    }

    return application;
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto) {
    const application = await this.prisma.application.findFirst({
      where: { userId, id },
    });

    if (!application) {
      throw new NotFoundException('Not found application');
    }

    return this.prisma.application.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(userId: string, id: string) {
    const application = await this.prisma.application.findFirst({
      where: { userId, id },
    });

    if (!application) {
      throw new NotFoundException('Not found application');
    }

    return this.prisma.application.delete({ where: { id } });
  }
}
