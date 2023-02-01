import { File } from "src/files/file.entity";
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { AfterLoad, Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Submission } from "../../submissions/entities/submission.entity";

export enum ChallengeInstance {
    SINGLE = "single",
    MULTIPLE = "multiple"
}

@Entity()
export class Challenge extends CustomBaseEntity {
    [x: string]: any;
    
    @Column()
    name: string;

    @Column()
    author: string;

    @Column('text')
    description: string;

    // @Column()
    // depends_on: string;

    @Column()
    category: string;

    @Column()
    difficulty: number

    @Column({ nullable: true })
    instance: ChallengeInstance

    @Column({ nullable: true })
    githubUrl: string

    @Column({ nullable: true })
    challengeUrl: string

    @Column()
    flag: string

    @Column({ default: 'manual' })
    source: string

    @OneToMany(() => Submission, submission => submission.challenge, { onDelete: "CASCADE" })
    submissions: Submission[];

    @OneToMany(() => File, file => file.challenge, { onDelete: "CASCADE" })
    files: File[]

    // To update on each flags
    @Column({default: 500})
    points: number;

    @Column({default: 0})
    solves: number;
}
