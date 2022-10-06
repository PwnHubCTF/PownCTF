import { Transform } from 'class-transformer'
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Config extends BaseEntity {
    @PrimaryColumn({ length: 255 })
    key: string;

    @Column({ length: 255 })
    value: string;

    @Column()
    valueType: string;

    // FIXME: why it's not working
    @Transform((param) => param.value.toUpperCase())
    @Column({ nullable: true })
    valueChoices: string;

    @Column({ length: 255, default: '' })
    description: string;
}

