import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    approveProduct: jest.fn(),
    findApprovedProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = { name: 'Test Product', price: 100, description: 'Test Description', quantity: 10 };
      const user = { id: 1 } as any; // Mocked user
      const createdProduct = { id: 1, ...createProductDto, owner: user };

      jest.spyOn(service, 'createProduct').mockResolvedValue(createdProduct as any);

      expect(await controller.createProduct({ user } as unknown as Request, createProductDto)).toEqual(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = { price: 150 };
      const user = { id: 1 } as any; // Mocked user
      const updatedProduct = { id: 1, ...updateProductDto, owner: user };

      jest.spyOn(service, 'updateProduct').mockResolvedValue(updatedProduct as any);

      expect(await controller.updateProduct(1, { user } as unknown as Request, updateProductDto)).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const user = { id: 1 } as any; // Mocked user
      jest.spyOn(service, 'deleteProduct').mockResolvedValue(undefined);

      await controller.deleteProduct(1, { user } as unknown as Request);
      expect(service.deleteProduct).toHaveBeenCalledWith(1, user);
    });
  });

  describe('approveProduct', () => {
    it('should approve a product', async () => {
      const approvedProduct = { id: 1, isApproved: true };

      jest.spyOn(service, 'approveProduct').mockResolvedValue(approvedProduct as any);

      expect(await controller.approveProduct(1)).toEqual(approvedProduct);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(service, 'approveProduct').mockImplementation(() => throwError(() => new Error('Product not found')));

      await expect(controller.approveProduct(1)).rejects.toThrow('Product not found');
    });
  });

  describe('getApprovedProducts', () => {
    it('should return all approved products', async () => {
      const products = [{ id: 1, isApproved: true }, { id: 2, isApproved: true }];

      jest.spyOn(service, 'findApprovedProducts').mockResolvedValue(products as any);

      expect(await controller.getApprovedProducts()).toEqual(products);
    });
  });
});
function throwError(arg0: () => Error): Promise<Product> {
  throw new Error('Function not implemented.');
}

