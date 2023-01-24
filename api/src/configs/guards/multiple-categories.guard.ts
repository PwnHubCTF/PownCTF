import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { MULTIPLE_CATEGORIES_KEY } from '../decorators/multiple-categories.decorator';
import { CategoriesService } from 'src/categories/categories.service';
@Injectable()
export class CtfStateGuard implements CanActivate {
  constructor(private reflector: Reflector, @Inject(CategoriesService) private categoriesService: CategoriesService) { }

  async canActivate (context: ExecutionContext) {
    const isMultiple = this.reflector.get<boolean>(MULTIPLE_CATEGORIES_KEY, context.getHandler());

    let categories = await this.categoriesService.findAll()
    
    const ok = isMultiple && categories.length > 1

    if (!ok) throw new ForbiddenException(`This route is only available for multiple categories CTF`)

    return true
  }
}
