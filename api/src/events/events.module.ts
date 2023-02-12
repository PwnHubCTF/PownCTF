import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventsController } from './events.controller';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
    controllers: [EventsController],
    providers: [EventsGateway, EventsService],
    imports: [AuthModule],
    exports: [EventsService]
})
export class EventsModule { }