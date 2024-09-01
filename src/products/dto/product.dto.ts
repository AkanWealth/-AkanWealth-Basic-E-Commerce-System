import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The price of the product', example: 19.99 })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ description: 'The description of the product' })
  @IsString()
  readonly description: string;

  @ApiProperty({ description: 'The quantity of the product', example: 100 })
  @IsNumber()
  readonly quantity: number;
}

export class UpdateProductDto {
  @ApiProperty({ description: 'The name of the product', required: false })
  @IsString()
  readonly name?: string;

  @ApiProperty({ description: 'The price of the product', required: false })
  @IsNumber()
  readonly price?: number;

  @ApiProperty({ description: 'The description of the product', required: false })
  @IsString()
  readonly description?: string;

  @ApiProperty({ description: 'The quantity of the product', required: false })
  @IsNumber()
  readonly quantity?: number;

  @ApiProperty({ description: 'Whether the product is approved or not', example: false })
  @IsBoolean()
  readonly isApproved?: boolean;
}
