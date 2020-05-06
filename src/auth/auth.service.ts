import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCrendential } from './dto/auth.credential';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService')
    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredential: AuthCrendential): Promise<void> {
        return this.userRepository.signUp(authCredential);
    }

    async signIn(authCredential: AuthCrendential): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validationUserPassword(authCredential);
        if(!username) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload)
        this.logger.debug(`Generated JWT Token with payload: ${JSON.stringify(payload)}`)
        return { accessToken };
    }
}
