
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Comment extends CustomBaseEntity {
    @Column()
    challengeId: string;

    @Column()
    ownerId: string;

    @Column({ type: 'text' })
    data: string;
}

