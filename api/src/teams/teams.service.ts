import { Injectable } from '@nestjs/common';
import { BaseCrudService } from 'src/utils/base-crud.service';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService extends BaseCrudService<Team>{}
