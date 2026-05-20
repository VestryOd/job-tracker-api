import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationsModule } from './applications/applications.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [PrismaModule, AuthModule, ApplicationsModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
