
import { Role } from "src/auth/role.enum";
import { Category } from "src/categories/entities/category.entity";
import { Submission } from "src/submissions/entities/submission.entity";
import { Team } from "src/teams/entities/team.entity";
import { User } from "src/users/entities/user.entity";
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity()
export class ResetToken extends CustomBaseEntity {
    @JoinColumn()
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user: User

    @Column({ length: 150 })
    token: string;
}

