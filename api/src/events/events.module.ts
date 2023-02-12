import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
    providers: [EventsGateway, EventsService],
    imports: [AuthModule]
})
export class EventsModule { }