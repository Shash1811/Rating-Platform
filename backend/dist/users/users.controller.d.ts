import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<Omit<import("./user.entity").User, "password">>;
    findAll(filters: FilterUsersDto): Promise<Omit<import("./user.entity").User, "password">[]>;
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    findOne(id: string): Promise<Omit<import("./user.entity").User, "password"> & {
        averageRating?: number;
        totalStores?: number;
        totalRatings?: number;
    }>;
    remove(id: string): Promise<void>;
}
