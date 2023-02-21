import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly eventsService: EventsService
    ) {
    }

    async handleDisconnect (socket: Socket) {
        this.eventsService.removeUserFromSockets(socket.id)
    }

    async handleConnection (socket: Socket) {
        const user = await this.eventsService.getUserFromSocket(socket);
        this.eventsService.addUserInSockets(user, socket)
    }

    // @SubscribeMessage('events')
    // findAll (@MessageBody() data: any): Observable<WsResponse<number>> {
    //     return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    // }

    // @SubscribeMessage('identity')
    // async identity (@MessageBody() data: number): Promise<number> {
    //     return data;
    // }
}