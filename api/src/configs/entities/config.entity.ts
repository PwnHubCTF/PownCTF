
import { CustomBaseEntity } from "src/custom-base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Config extends CustomBaseEntity {
    @Column({ length: 255, unique: true })
    key: string;

    @Column({ length: 255 })
    value: User[];
}

