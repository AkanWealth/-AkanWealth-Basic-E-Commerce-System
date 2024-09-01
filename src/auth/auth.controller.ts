import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: { name: string; email: string; password: string }) {
        return this.authService.register(createUserDto.name, createUserDto.email, createUserDto.password);
    }

    @Post('login')
    async login(@Body() loginUserDto: { email: string; password: string }) {
        const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
        if (user) {
            return this.authService.login(user);
        }
        return { message: 'Invalid credentials' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
