import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { request } from 'express';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { CTF_STATES } from 'src/configs/configs.settings';
import { CtfState } from 'src/configs/decorators/ctf-state.decorator';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) { }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Post()
  create (@Body() createDto: CreateCategoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll () {
    return this.service.findAll();
  }

  @Get('isEnabled')
  isEnabled () {
    return this.service.isCategoryModeEnable()
  }

  @ApiBearerAuth()
  @CtfState(CTF_STATES.WAITING, CTF_STATES.STARTED)
  @NeedRole(Role.User)
  @Post('join/:id')
  join (@InjectUser() user: User, @Param('id') id: string) {
    return this.service.join(user, id);
  }

  @Get(':id')
  findOne (@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Patch(':id')
  update (@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @ApiBearerAuth()
  @NeedRole(Role.Manager)
  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.service.remove(id);
  }

}
