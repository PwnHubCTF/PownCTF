import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { AfterLoad, Column, Entity, OneToMany } from "typeorm";
import { Submission } from "../../submissions/entities/submission.entity";

@Entity()
export class Challenge extends CustomBaseEntity {

    point: number
    solved: boolean
    nbrOfSolved: number

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
            this.nbrOfSolved = 0
            for (const submission of this.submissions) 
                if (submission.flag === this.flag) this.nbrOfSolved++
            
            this.point = 500 - (this.nbrOfSolved * 10)
            this.submissions = undefined
        }
    }
}
