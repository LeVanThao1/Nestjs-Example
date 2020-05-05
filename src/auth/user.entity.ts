import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    async validationPassword(password: string): Promise<boolean> {
        const hashPassword = await bcrypt.hash(password, this.salt);
        return hashPassword === this.password;
    }
}