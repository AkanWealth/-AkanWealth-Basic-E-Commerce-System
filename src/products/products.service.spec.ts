import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockProductRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepository() },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const user = new User();
      const createProductDto = { name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 };
      const savedProduct = { id: 1, ...createProductDto, owner: user };

      jest.spyOn(repository, 'create').mockReturnValue(savedProduct as Product);
      jest.spyOn(repository, 'save').mockResolvedValue(savedProduct as Product);

      expect(await service.createProduct(user, createProductDto)).toEqual(savedProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product', async () => {
      const user = new User();
      const updateProductDto = { price: 150 };
      const existingProduct = { id: 1, name: 'Test Product', price: 100, description: 'Test Description', quantity: 10, owner: user };
      const updatedProduct = { ...existingProduct, ...updateProductDto };

      jest.spyOn(service, 'findProductByIdAndOwner').mockResolvedValue(existingProduct as Product);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct as Product);

      expect(await service.updateProduct(1, user, updateProductDto)).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const user = new User();
      const product = { id: 1, name: 'Test Product', price: 100, description: 'Test Description', quantity: 10, owner: user };

      jest.spyOn(service, 'findProductByIdAndOwner').mockResolvedValue(product as Product);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.deleteProduct(1, user);
      expect(repository.remove).toHaveBeenCalledWith(product);
    });
  });

  describe('approveProduct', () => {
    it('should approve and return a product', async () => {
      const product = { id: 1, isApproved: false };
      const approvedProduct = { ...product, isApproved: true };

      jest.spyOn(repository, 'findOne').mockResolvedValue(product as Product);
      jest.spyOn(repository, 'save').mockResolvedValue(approvedProduct as Product);

      expect(await service.approveProduct(1)).toEqual(approvedProduct);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.approveProduct(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findProductByIdAndOwner', () => {
    it('should return a product owned by the user', async () => {
      const user = new User();
      const product = { id: 1, owner: user };

      jest.spyOn(repository, 'findOne').mockResolvedValue(product as Product);

      expect(await service.findProductByIdAndOwner(1, user)).toEqual(product);
    });

    it('should throw NotFoundException if product is not owned by user', async () => {
      const user = new User();
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findProductByIdAndOwner(1, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findApprovedProducts', () => {
    it('should return an array of approved products', async () => {
      const products = [{ id: 1, isApproved: true }, { id: 2, isApproved: true }];

      jest.spyOn(repository, 'find').mockResolvedValue(products as Product[]);

      expect(await service.findApprovedProducts()).toEqual(products);
    });
  });
});
