import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Submission } from "../../submissions/entities/submission.entity";

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

    @OneToMany(() => Submission, submission => submission.challenge)
    submissions: Submission[];
}
