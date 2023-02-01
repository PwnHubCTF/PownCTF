import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { mkdir, copyFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {


  constructor(
    @InjectRepository(File) protected readonly repository: Repository<File>,
    
  ) { }

  /**
   * Get a file
   * @returns File
   */
  async findOne (id: string) {
    let file = await this.repository.findOne({ where: { id }, cache: 5000 })
    if (!file) throw new NotFoundException('File not found')
    return file
  }

  async addFileFromPath(path: string){
    const filename = path.split('/')[path.split('/').length-1]
    const newPath = `challenge_files/${randomUUID()}`
    const file = this.repository.create({
      name: filename,
      path: newPath
    })
    await mkdir('challenge_files', {recursive: true })
    await copyFile(path, file.path)
    file.save()
    return file
  }

  async deleteFiles (files: File[]) {
    for (const file of files) {
      await unlink(file.path)
    }
  }

}

