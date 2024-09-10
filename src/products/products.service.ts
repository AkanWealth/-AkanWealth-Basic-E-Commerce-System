import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Products } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) { }

  async createProduct(user: Users, createProductDto: any): Promise<Products[]> {
    const product = this.productRepository.create({ ...createProductDto, owner: user });
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, user: Users, updateProductDto: any): Promise<Products> {
    const product = await this.findProductByIdAndOwner(id, user);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number, user: Users): Promise<void> {
    const product = await this.findProductByIdAndOwner(id, user);
    await this.productRepository.remove(product);
  }

  async approveProduct(id: number): Promise<Products> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Products not found');
    product.isApproved = true;
    return this.productRepository.save(product);
  }

  async findProductByIdAndOwner(id: number, user: Users): Promise<Products> {
    const product = await this.productRepository.findOne({ where: { id, owner: user } });
    if (!product) throw new NotFoundException('Products not found or not owned by user');
    return product;
  }

  async findApprovedProducts(): Promise<Products[]> {
    return this.productRepository.find({ where: { isApproved: true } });
  }
}
