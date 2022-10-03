import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Category extends CustomBaseEntity {
    @Column({ length: 255, unique: true })
    name: string;

    @Column()
    description: string;

    @OneToMany(()=>User, (user)=> user.category)
    users: User[];
}

