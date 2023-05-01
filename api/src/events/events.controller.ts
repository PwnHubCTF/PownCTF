import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { EventsService } from './events.service';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

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
    @Post(':id')
    sendToPlayer (@InjectUser() user: User, @Body('message') message: string,@Param('id') userId: string) {
        return this.eventsService.sendEventToUser(userId, 'message', `(${user.pseudo}) ${message}`);
    }

    @ApiBearerAuth()
    @NeedRole(Role.Manager)
    @Post()
    postEvent (@InjectUser() user: User, @Body('message') message: string) {
        return this.eventsService.broadcastEventToUsers('message', `(${user.pseudo}) ${message}`);
    }
}
