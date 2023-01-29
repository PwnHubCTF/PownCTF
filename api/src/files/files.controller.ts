
import { Controller, Get, Param, Post, Res, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FilesService } from './files.service';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get(':id')
  async getFile(@Res({ passthrough: true }) res: Response, @Param('id') id: string): Promise<StreamableFile> {
    const file = await this.filesService.findOne(id)
    const stream = createReadStream(join(process.cwd(), file.path));
    res.set({
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });
    return new StreamableFile(stream);
  }
}

