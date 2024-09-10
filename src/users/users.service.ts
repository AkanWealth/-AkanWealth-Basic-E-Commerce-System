import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async findOne(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userDto: CreateUserDto): Promise<Users> {
    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.findOne(email);
    if (user && !user.isBanned && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async banUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isBanned = true;
    await this.userRepository.save(user);
  }

  async unBanUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isBanned = false;
    await this.userRepository.save(user);
  }

  async changeUserRole(id: number, role: UserRole): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.userRepository.save(user);
  }
}
