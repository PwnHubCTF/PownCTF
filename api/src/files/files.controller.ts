
import { Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { FilesService } from './files.service';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get(':id')
  async getFile(@Res({ passthrough: true }) res: Response, @Param('id') id: string): Promise<StreamableFile> {
    const file = await this.filesService.findOne(id)
    const stream = createReadStream(file.path);
    res.set({
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });
    return new StreamableFile(stream);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    const dest = join(process.cwd(), 'uploads/logo')
    await writeFile(dest, file.buffer)
    return true
  }
}

