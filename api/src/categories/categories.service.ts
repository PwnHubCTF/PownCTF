import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { BaseCrudService } from 'src/utils/base-crud.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService extends BaseCrudService<Category> {

  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>
  ) { super(repository) }

  async join(user: User, id: string){
    if(user.category != null) throw new ForbiddenException('You are already in a category')

    const categoy = await this.findOne(id)

    if(!categoy) throw new ForbiddenException(`This category doesn't exists`)

    user.category = categoy
    user.save()

    return "You joined a category"
  }

  async isCategoryModeEnable(){
    let c = await this.findAll()
    return c.length > 1
  }

}
