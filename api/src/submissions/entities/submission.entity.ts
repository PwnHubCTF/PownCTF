import { User } from "src/users/entities/user.entity"
import { CustomBaseEntity } from "src/utils/custom-base.entity"
import { Column, Entity, ManyToOne } from "typeorm"
import { Challenge } from "../../challenges/entities/challenge.entity"

@Entity()
export class Submission extends CustomBaseEntity {
    @Column()
    public challengeId: number

    @Column()
    public userId: number

    @ManyToOne(() => Challenge, (challenge) => challenge.submissions, { onDelete: "CASCADE"})
    public challenge: Challenge

    @ManyToOne(() => User, (user) => user.submissions)
    public user: User

    @Column()
    public flag: string

    @Column({default: false})
    public isValid: boolean
}