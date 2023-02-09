
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Team extends CustomBaseEntity {
    @Column({ length: 35, unique: true })
    name: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 255 })
    secretHash: string;

    @JoinColumn()
    @OneToOne(() => User)
    leader: User

    @OneToMany(() => User, (user) => user.team)
    users: User[];
}

