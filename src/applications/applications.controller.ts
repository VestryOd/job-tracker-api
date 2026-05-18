import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { QueryApplicationDto } from './dto/query-application.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Get()
  getApplications(
    @CurrentUser() user: JwtPayload,
    @Query() query: QueryApplicationDto,
  ) {
    return this.service.findAll(user.sub, query);
  }

  @Get(':id')
  getApplicationById(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.findOne(user.sub, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createApplication(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.service.create(user.sub, dto);
  }

  @Patch(':id')
  updateApplication(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.service.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  deleteApplication(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.remove(user.sub, id);
  }
}
