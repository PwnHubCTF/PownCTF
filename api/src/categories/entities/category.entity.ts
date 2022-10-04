import { User } from "src/users/entities/user.entity";
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Category extends CustomBaseEntity {
    @Column({ length: 255, unique: true })
    name: string;

    @Column()
    description: string;

    @OneToMany(() => User, (user) => user.category)
    users: User[];
}

