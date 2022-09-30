
import { Role } from "src/auth/role.enum";
import { CustomBaseEntity } from "src/custom-base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Team extends CustomBaseEntity {
    @Column({ length: 255, unique: true })
    name: string;

    @OneToOne(()=>User)
    leader: User

    @ManyToOne(()=>User)
    users: User[];
}

