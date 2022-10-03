
import { Role } from "src/auth/role.enum";
import { Category } from "src/categories/entities/category.entity";
import { CustomBaseEntity } from "src/utils/custom-base.entity";
import { Team } from "src/teams/entities/team.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class User extends CustomBaseEntity {
    @Column({ length: 255, unique: true })
    pseudo: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ default: Role.User })
    role: Role;

    @ManyToOne(()=>Category, (cat) => cat.users)
    category: Category;

    @ManyToOne(()=>Team, (team) => team.users)
    team: Team;
}

