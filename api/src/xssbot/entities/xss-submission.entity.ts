import { CustomBaseEntity } from "src/utils/custom-base.entity"
import { Column, Entity } from "typeorm"

@Entity()
export class XSSSubmission extends CustomBaseEntity {
    @Column()
    public challengeId: string

    @Column()
    public userId: string

    @Column({ type: "text" })
    public payload: string
}