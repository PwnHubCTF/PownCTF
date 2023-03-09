import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
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
        return this.service.postComment(user, challengeId, createDto);
    }
    
    @ApiBearerAuth()
    @ApiQuery({name: 'limit', required: false})
    @ApiQuery({name: 'page', required: false})
    @NeedRole(Role.Manager)
    @Get()
    findOne (@Query('limit') limit = 10, @Query('page') page = 0) {
        return this.service.all(limit, page);
    }

}
