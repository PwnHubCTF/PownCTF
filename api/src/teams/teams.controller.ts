import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('teams')
@ApiTags('teams')
export class TeamsController {}
