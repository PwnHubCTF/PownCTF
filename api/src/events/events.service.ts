
import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { getClientIp } from 'request-ip';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';

type UserSocket = {
    [key: string]: {
        socket: Socket,
        userId: string,
        teamId: string,
        ip: string
    }
}

@Injectable()
export class EventsService {
    private userSockets: UserSocket = {}
    private logger = new Logger("EventsService");

    constructor(private authService: AuthService,
    ) {

    }

    addUserInSockets (user: User, socket: Socket) {
        const ip = getClientIp(socket.request)
        this.logger.verbose(`${user.id} connect with ip ${ip}`)        
        this.userSockets[socket.id] = {
            socket,
            userId: user.id,
            teamId: user.team?.id,
            ip: ip
        }
    }

    removeUserFromSockets (socketId) {
        delete this.userSockets[socketId]
    }

    updateSocketTeamId(userId, teamId){
        for (const socketId in this.userSockets) {
            if (this.userSockets[socketId].userId == userId) {
                this.userSockets[socketId].teamId = teamId
                return
            }
        }
    }

    sendEventToTeam (teamId: string, event: string, message) {
        for (const socketId in this.userSockets) {
            if (this.userSockets[socketId].teamId == teamId) {
                this.userSockets[socketId].socket.emit(event, message)
            }
        }
    }

    sendEventToUser (userId: string, event: string, message) {
        for (const socketId in this.userSockets) {
            if (this.userSockets[socketId].userId == userId) {
                this.userSockets[socketId].socket.emit(event, message)
            }
        }
    }

    getConnectedSockets(){
        let formated = []
        for (const socketId in this.userSockets) {
            formated.push({
                userId: this.userSockets[socketId].userId,
                ip: this.userSockets[socketId].ip
            })
        }
        return formated
    }

    broadcastEventToUsers (event: string, message) {
        for (const socketId in this.userSockets) {
            this.userSockets[socketId].socket.emit(event, message)
        }
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