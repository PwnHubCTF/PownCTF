
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Comment extends CustomBaseEntity {
    @Column()
    challengeId: string;

    @Column()
    ownerId: string;

    @Column({ default: 'player' })
    type: string;

    @Column({ type: 'json' })
    data: any;
}

