import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { MockedObject } from 'jest-mock';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockedObject<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, email: 'test@example.com' }] as User[];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by email', async () => {
      const result = { id: 1, email: 'test@example.com' } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne('test@example.com')).toBe(result);
    });

    it('should return undefined if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      expect(await service.findOne('test@example.com')).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com', password: 'password',
        name: ''
      };
      const result = { id: 1, ...createUserDto } as User;
      jest.spyOn(repository, 'create').mockReturnValue(result);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(createUserDto)).toBe(result);
    });
  });

  describe('validateUser', () => {
    it('should return the user if email and password are correct', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 1, email, password, isBanned: false } as User;
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      expect(await service.validateUser(email, password)).toBe(user);
    });

    it('should return null if user is banned', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 1, email, password, isBanned: true } as User;
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      expect(await service.validateUser(email, password)).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 1, email, password, isBanned: false } as User;
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      expect(await service.validateUser(email, password)).toBeNull();
    });
  });

  describe('banUser', () => {
    it('should ban a user', async () => {
      const user = { id: 1, isBanned: false } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...user, isBanned: true });

      await service.banUser(1);
      expect(repository.save).toHaveBeenCalledWith({ ...user, isBanned: true });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.banUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unBanUser', () => {
    it('should unban a user', async () => {
      const user = { id: 1, isBanned: true } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...user, isBanned: false });

      await service.unBanUser(1);
      expect(repository.save).toHaveBeenCalledWith({ ...user, isBanned: false });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.unBanUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeUserRole', () => {
    it('should change the user role', async () => {
      const role = UserRole.ADMIN;
      const user = { id: 1, role } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...user, role });

      await service.changeUserRole(1, role);
      expect(repository.save).toHaveBeenCalledWith({ ...user, role });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.changeUserRole(1, UserRole.ADMIN)).rejects.toThrow(NotFoundException);
    });
  });
});
