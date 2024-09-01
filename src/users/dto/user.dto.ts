import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum } from 'class-validator';

import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'The password for the user account' })
  @IsString()
  readonly password: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'The new role of the user', enum: UserRole })
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty({ description: 'Whether the user is banned or not', example: false })
  readonly isBanned: boolean;
}
