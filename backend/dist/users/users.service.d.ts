import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    findAll(filters: FilterUsersDto): Promise<Omit<User, 'password'>[]>;
    findOne(id: number): Promise<Omit<User, 'password'> & {
        averageRating?: number;
        totalStores?: number;
        totalRatings?: number;
    }>;
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    remove(id: number): Promise<void>;
}
