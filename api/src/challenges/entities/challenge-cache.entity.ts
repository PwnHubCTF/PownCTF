import { AfterLoad, BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Submission } from "../../submissions/entities/submission.entity";
import { Challenge } from "./challenge.entity";

@Entity()
export class ChallengeCache extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    points: number;

    @Column()
    solves: number;
}
