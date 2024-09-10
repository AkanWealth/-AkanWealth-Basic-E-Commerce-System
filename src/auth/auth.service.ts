import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) {}

    async register(name: string, email: string, password: string): Promise<Users> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ name, email, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async validateUser(email: string, password: string): Promise<Users | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && !user.isBanned && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(user: Users) {
        const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
