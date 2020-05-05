import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCrendential } from "./dto/auth.credential";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredential: AuthCrendential): Promise<void> {
        const { username, password } = authCredential;
        const user = new User();
        user.salt = await bcrypt.genSalt();
        user.username = username;
        user.password = await this.hashPassword(password, user.salt);
        
        try {
            await user.save();
        } catch (e) {
            if(e.code === '23505') {
                throw new ConflictException("Username already exists")
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validationUserPassword(authCredential: AuthCrendential): Promise<string> {
        const { username , password } = authCredential;
        const user = await this.findOne({ username});
        if(user && await user.validationPassword(password)) {
            return user.username;
        }
        return null;
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}