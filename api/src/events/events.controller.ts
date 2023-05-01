import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { EventsService } from './events.service';

@Controller('events')
@ApiTags('events')
export class EventsController {
    constructor(protected eventsService: EventsService) { }

    @ApiBearerAuth()
    @NeedRole(Role.Manager)
    @Get()
    all () {
        return this.eventsService.getConnectedSockets();
    }

    @ApiBearerAuth()
    @NeedRole(Role.Manager)
    @Post()
    postEvent (@Body('message') message: string) {
        return this.eventsService.broadcastEventToUsers('message', message);
    }
}
