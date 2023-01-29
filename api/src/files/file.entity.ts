import { Challenge } from "src/challenges/entities/challenge.entity";
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity, ManyToOne } from "typeorm";


@Entity()
export class File extends CustomBaseEntity {
    @Column()
    name: string;

    @Column()
    path: string

    @ManyToOne(() => Challenge, challenge => challenge.files, { onDelete: "CASCADE" })
    challenge: Challenge;
}
