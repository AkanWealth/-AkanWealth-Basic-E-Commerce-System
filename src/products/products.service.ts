import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async createProduct(user: User, createProductDto: any): Promise<Product[]> {
    const product = this.productRepository.create({ ...createProductDto, owner: user });
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, user: User, updateProductDto: any): Promise<Product> {
    const product = await this.findProductByIdAndOwner(id, user);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number, user: User): Promise<void> {
    const product = await this.findProductByIdAndOwner(id, user);
    await this.productRepository.remove(product);
  }

  async approveProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.isApproved = true;
    return this.productRepository.save(product);
  }

  async findProductByIdAndOwner(id: number, user: User): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, owner: user } });
    if (!product) throw new NotFoundException('Product not found or not owned by user');
    return product;
  }

  async findApprovedProducts(): Promise<Product[]> {
    return this.productRepository.find({ where: { isApproved: true } });
  }
}
