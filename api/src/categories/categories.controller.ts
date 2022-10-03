import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) { }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
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

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Patch(':id')
  update (@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Admin)
  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.service.remove(id);
  }

}
