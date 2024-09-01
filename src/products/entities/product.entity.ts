import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @Column()
    description: string;

    @Column('int')
    quantity: number;

    @Column({ default: false })
    isApproved: boolean;

    @ManyToOne(() => User, user => user.id)
    owner: User;
}
