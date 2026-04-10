import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  FilterUsersDto,
  SortOrder,
  UserSortBy,
} from './dto/filter-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { name, email, password, address, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll(filters: FilterUsersDto): Promise<Omit<User, 'password'>[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters.name) {
      queryBuilder.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    }

    if (filters.address) {
      queryBuilder.andWhere('user.address ILIKE :address', { address: `%${filters.address}%` });
    }

    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    const sortBy = filters.sortBy ?? UserSortBy.NAME;
    const sortOrder = (filters.sortOrder ?? SortOrder.ASC).toUpperCase() as 'ASC' | 'DESC';
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    const users = await queryBuilder.getMany();

    // Remove passwords from response
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id: number): Promise<Omit<User, 'password'> & {
    averageRating?: number;
    totalStores?: number;
    totalRatings?: number;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['stores', 'stores.ratings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    if (user.role !== UserRole.STORE_OWNER) {
      return userWithoutPassword;
    }

    const totalStores = user.stores.length;
    const storeRatings = user.stores.flatMap((store) => store.ratings ?? []);
    const totalRatings = storeRatings.length;
    const ratingSum = storeRatings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;

    return {
      ...userWithoutPassword,
      averageRating,
      totalStores,
      totalRatings,
    };
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
  }> {
    const totalUsers = await this.userRepository.count();
    
    // These would be more complex queries in production
    const totalStores = await this.userRepository.query(
      'SELECT COUNT(*) FROM stores'
    );
    
    const totalRatings = await this.userRepository.query(
      'SELECT COUNT(*) FROM ratings'
    );

    return {
      totalUsers,
      totalStores: parseInt(totalStores[0].count),
      totalRatings: parseInt(totalRatings[0].count),
    };
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
