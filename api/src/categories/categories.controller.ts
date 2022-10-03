import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth()
@NeedRole(Role.Admin)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) { }

  @Post()
  create (@Body() createDto: CreateCategoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll () {
    return this.service.findAll();
  }

  @Get(':id')
  findOne (@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update (@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.service.remove(id);
  }

}
