import { SetMetadata } from '@nestjs/common';

export const MULTIPLE_CATEGORIES_KEY = 'multiple';
export const IsMultipleCategories = (multiple: boolean) => SetMetadata('multiple', multiple);