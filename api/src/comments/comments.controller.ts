import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NeedRole } from 'src/auth/decorators/need-role.decorator';
import { Role } from 'src/auth/role.enum';
import { InjectUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
    constructor(private readonly service: CommentsService) { }

    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Post(':id')
    create (@InjectUser() user: User, @Param('id') challengeId: string, @Body() createDto: CreateCommentDto) {
        return this.service.postComment(user.id, challengeId, createDto);
    }
    
    @ApiBearerAuth()
    @NeedRole(Role.User)
    @Get(':id')
    findOne (@InjectUser() user: User, @Param('id') challengeId: string) {
        return this.service.findForChallenge(user.id, challengeId);
    }

}
