import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { Products } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
