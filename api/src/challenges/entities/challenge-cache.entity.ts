import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChallengeCache extends BaseEntity {
    @PrimaryColumn()
    challengeId: string
    
    @Column()
    points: number;

    @Column()
    solves: number;
}
