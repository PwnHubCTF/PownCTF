import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('configs')
@ApiTags('config')
export class ConfigsController {}
