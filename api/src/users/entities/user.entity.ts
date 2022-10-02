
import { Role } from "src/auth/role.enum";
import { CustomBaseEntity } from "src/custom-base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends CustomBaseEntity {
    @Column({ length: 255, unique: true })
    pseudo: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ default: Role.User })
    role: Role;

    @Column({ length: 255, default: 'all' })
    category: string;
}

