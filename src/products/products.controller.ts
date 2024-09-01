import { Controller, Post, Body, UseGuards, Request, Param, Patch, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ProductService } from './products.service';
import { UserRole } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'The product has been created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(req.user, createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the product to update' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'The product has been updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(@Param('id') id: number, @Request() req, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, req.user, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the product to delete' })
  @ApiResponse({ status: 200, description: 'The product has been deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: number, @Request() req) {
    return this.productService.deleteProduct(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the product to approve' })
  @ApiResponse({ status: 200, description: 'The product has been approved successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async approveProduct(@Param('id') id: number) {
    return this.productService.approveProduct(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all approved products' })
  @ApiResponse({ status: 200, description: 'Return all approved products' })
  async getApprovedProducts() {
    return this.productService.findApprovedProducts();
  }
}
