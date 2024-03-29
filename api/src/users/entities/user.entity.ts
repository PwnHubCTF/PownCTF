
import { Role } from "src/auth/role.enum";
import { Category } from "src/categories/entities/category.entity";
import { Submission } from "src/submissions/entities/submission.entity";
import { Team } from "src/teams/entities/team.entity";
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class User extends CustomBaseEntity {
    @Column({ length: 26, unique: true })
    pseudo: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ default: false })
    spaceship: boolean; //TODO remove it later

    @Column({ default: Role.User })
    role: Role;

    @ManyToOne(() => Category, (cat) => cat.users, { onDelete: "SET NULL" })
    category: Category;

    @ManyToOne(() => Team, (team) => team.users, { onDelete: "SET NULL" })
    team: Team;

    @OneToMany(() => Submission, submission => submission.user)
    submissions: Submission[];

    @Column({default: 0})
    points: number;
}

