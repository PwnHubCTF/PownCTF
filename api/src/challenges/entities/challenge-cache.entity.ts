import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChallengeCache extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    points: number;

    @Column()
    solves: number;
}
