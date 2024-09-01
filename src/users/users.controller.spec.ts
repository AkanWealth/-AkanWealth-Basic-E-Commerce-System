import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MockedObject } from 'jest-mock';

describe('UsersController', () => {
  let controller: UsersController;
  let service: MockedObject<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            banUser: jest.fn(),
            unBanUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com', password: 'password',
        name: 'Paul'
      };
      const result = { id: 1, ...createUserDto } as User;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.register(createUserDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, email: 'test@example.com' }] as User[];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('banUser', () => {
    it('should ban a user by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'banUser').mockResolvedValue(undefined);

      await controller.banUser(id);
      expect(service.banUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = '1';
      jest.spyOn(service, 'banUser').mockRejectedValue(new NotFoundException());

      await expect(controller.banUser(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unBanUser', () => {
    it('should unban a user by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'unBanUser').mockResolvedValue(undefined);

      await controller.unBanUser(id);
      expect(service.unBanUser).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = '1';
      jest.spyOn(service, 'unBanUser').mockRejectedValue(new NotFoundException());

      await expect(controller.unBanUser(id)).rejects.toThrow(NotFoundException);
    });
  });
});
