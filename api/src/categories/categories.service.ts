import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/utils/base-crud.service';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService extends BaseCrudService<CreateCategoryDto,UpdateCategoryDto> {

  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>
  ) { super(repository) }

}
