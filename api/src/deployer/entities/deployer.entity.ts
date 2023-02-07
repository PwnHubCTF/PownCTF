import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Deployer extends BaseEntity {
    @PrimaryColumn({ length: 255 })
    url: string;

    @Column({ length: 255 })
    token: string;
}

