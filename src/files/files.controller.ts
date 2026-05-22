import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@ApiBearerAuth()
@Controller('applications/:id/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/presigned-upload')
  getPresignedUpload(
    @CurrentUser() user: JwtPayload,
    @Body() dto: PresignedUploadDto,
    @Param('id') id: string,
  ) {
    return this.filesService.getPresignedUpload(id, user.sub, dto);
  }

  @Get('/')
  getFiles(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.filesService.getFiles(id, user.sub);
  }
}
