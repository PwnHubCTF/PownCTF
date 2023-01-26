import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { AfterLoad, Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Submission } from "../../submissions/entities/submission.entity";
import { ChallengeCache } from "./challenge-cache.entity";

export enum ChallengeInstance {
    SINGLE = "single",
    MULTIPLE = "multiple"
}

@Entity()
export class Challenge extends CustomBaseEntity {

    point: number
    solved: boolean
    nbrOfSolved: number

    @Column()
    name: string;

    @Column()
    author: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    difficulty: number

    @Column({nullable: true})
    instance: ChallengeInstance

    @Column({nullable: true})
    githubUrl: string

    @Column()
    flag: string

    @Column({default: 'manual'})
    source: string

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
