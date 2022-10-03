import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/utils/base-crud.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService extends BaseCrudService<Category> {

  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>
  ) { super(repository) }

}
