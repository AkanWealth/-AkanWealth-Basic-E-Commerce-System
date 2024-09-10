import { Users } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Products {
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

    @ManyToOne(() => Users, user => user.id)
    owner: Users;
}
