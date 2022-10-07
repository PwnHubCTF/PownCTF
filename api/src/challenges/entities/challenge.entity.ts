import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { AfterLoad, Column, Entity, OneToMany } from "typeorm";
import { Submission } from "../../submissions/entities/submission.entity";

@Entity()
export class Challenge extends CustomBaseEntity {

    point: number
    solved: boolean

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

    @AfterLoad()
    updatePoints () {
        if (this.submissions != undefined) {
            let valids = 0
            for (const submission of this.submissions) {
                if (submission.flag === this.flag) {
                    valids++
                }
            }
            this.point = 500 - (valids * 10)
        }
    }
}
