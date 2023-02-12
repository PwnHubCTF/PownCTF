
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';

// class UserSocket {
//     constructor(private socket: Socket,private teamId: string){

//     }

//     public sendMessage
// }

type UserSocket = {
    [key: string]: {
        socket: Socket,
        userId: string,
        teamId: string
    }
}

@Injectable()
export class EventsService {
    private userSockets: UserSocket = {}
    constructor(private authService: AuthService
    ) {

    }

    addUserInSockets (user: User, socket: Socket) {
        console.log('New user');
        
        this.userSockets[socket.id] = {
            socket,
            userId: user.id,
            teamId: user.team.id,
        }
    }

    removeUserFromSockets (socketId) {
        delete this.userSockets[socketId]
    }

    async getUserFromSocket (socket: Socket) {
        const jwt = socket.handshake.auth.jwt;
        try {
            let user = await this.authService.getUserFromToken(jwt)
            return user;
        } catch (error) {
            throw new WsException('Forbidden')
        }
    }
}