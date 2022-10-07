import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { CustomBaseEntity } from "src/utils/custom-base.entity"
import { Challenge } from "./challenge.entity"
import { User } from "src/users/entities/user.entity"

@Entity()
export class Submission extends CustomBaseEntity {
    @Column()
    public challengeId: number

    @Column()
    public userId: number

    @Column()
    public flag: number

    @ManyToOne(() => Challenge, (challenge) => challenge.submissions)
    public challenge: Challenge

    @ManyToOne(() => User, (user) => user.submissions)
    public user: User
}