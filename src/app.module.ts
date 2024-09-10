import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Users } from './users/entities/user.entity';
import { Products } from './products/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      // host: process.env.DATABASE_HOST,
      // port: +process.env.DATABASE_PORT,
      // username: process.env.DATABASE_USERNAME,
      // password: process.env.DATABASE_PASSWORD,
      // database: process.env.DATABASE_NAME,
      entities: [Users, Products],
      synchronize: true, // Set to false in production
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    UsersModule,
    ProductsModule,
  ],
})
export class AppModule {}
