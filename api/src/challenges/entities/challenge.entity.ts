import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Challenge extends CustomBaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    author: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    difficulty: number

    @Column()
    flag: string
}
