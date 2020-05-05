import { Controller, Post, Body, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCrendential } from './dto/auth.credential';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
    
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCrendential: AuthCrendential): Promise<void> {
        return this.authService.signUp(authCrendential);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCrendential: AuthCrendential): Promise<{ accessToken: string}> {
        return this.authService.signIn(authCrendential);
    }

    // only test
    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@GetUser() user: User ) {
    //     console.log(user);
    // }
}
