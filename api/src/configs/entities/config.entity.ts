import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Config extends BaseEntity {
    @PrimaryColumn({ length: 255 })
    key: string;

    @Column({ length: 255 })
    value: string;

    @Column({ length: 255, default: '' })
    description: string;
}

