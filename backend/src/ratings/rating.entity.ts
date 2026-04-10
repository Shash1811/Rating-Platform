import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';

@Entity('ratings')
@Unique(['user', 'store']) // A user can only rate a store once
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  rating: number;

  @ManyToOne(() => User, user => user.ratings)
  user: User;

  @ManyToOne(() => Store, store => store.ratings)
  store: Store;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
