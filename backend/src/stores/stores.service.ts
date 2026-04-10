import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { User, UserRole } from '../users/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import {
  FilterStoresDto,
  SortOrder,
  StoreSortBy,
} from './dto/filter-stores.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { name, email, address, ownerId } = createStoreDto;

    // Check if store email already exists
    const existingStore = await this.storeRepository.findOne({ where: { email } });
    if (existingStore) {
      throw new ConflictException('Store with this email already exists');
    }

    // Verify owner exists and is a store owner
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    if (owner.role !== UserRole.STORE_OWNER) {
      throw new ForbiddenException('Only store owners can own stores');
    }

    // Create new store
    const store = this.storeRepository.create({
      name,
      email,
      address,
      owner,
    });

    return this.storeRepository.save(store);
  }

  async findAll(filters: FilterStoresDto): Promise<Store[]> {
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoinAndSelect('store.ratings', 'ratings')
      .leftJoinAndSelect('ratings.user', 'ratingUser');

    if (filters.name) {
      queryBuilder.andWhere('store.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.email) {
      queryBuilder.andWhere('store.email ILIKE :email', { email: `%${filters.email}%` });
    }

    if (filters.address) {
      queryBuilder.andWhere('store.address ILIKE :address', { address: `%${filters.address}%` });
    }

    const sortBy = filters.sortBy ?? StoreSortBy.NAME;
    const sortOrder = (filters.sortOrder ?? SortOrder.ASC).toUpperCase() as 'ASC' | 'DESC';

    if (sortBy !== StoreSortBy.AVERAGE_RATING) {
      queryBuilder.orderBy(`store.${sortBy}`, sortOrder);
    }

    const stores = await queryBuilder.getMany();

    // Calculate average rating for each store
    const storesWithRatings = stores.map(store => {
      const storeWithRating = { ...store };
      if (store.ratings && store.ratings.length > 0) {
        const totalRating = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        storeWithRating['averageRating'] = totalRating / store.ratings.length;
      } else {
        storeWithRating['averageRating'] = 0;
      }
      return storeWithRating;
    });

    if (sortBy === StoreSortBy.AVERAGE_RATING) {
      storesWithRatings.sort((a, b) => {
        const aRating = (a as any).averageRating ?? 0;
        const bRating = (b as any).averageRating ?? 0;
        return sortOrder === 'ASC' ? aRating - bRating : bRating - aRating;
      });
    }

    return storesWithRatings;
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings', 'ratings.user'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Calculate average rating
    if (store.ratings && store.ratings.length > 0) {
      const totalRating = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      (store as any).averageRating = totalRating / store.ratings.length;
    } else {
      (store as any).averageRating = 0;
    }

    return store;
  }

  async findByOwner(ownerId: number): Promise<Store[]> {
    const stores = await this.storeRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['ratings', 'ratings.user'],
    });

    // Calculate average rating for each store
    return stores.map(store => {
      const storeWithRating = { ...store };
      if (store.ratings && store.ratings.length > 0) {
        const totalRating = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        storeWithRating['averageRating'] = totalRating / store.ratings.length;
        storeWithRating['ratingUsers'] = store.ratings.map(rating => ({
          user: rating.user,
          rating: rating.rating,
          createdAt: rating.createdAt,
        }));
      } else {
        storeWithRating['averageRating'] = 0;
        storeWithRating['ratingUsers'] = [];
      }
      return storeWithRating;
    });
  }

  async remove(id: number, requestingUserId: number, requestingUserRole: UserRole): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if user is admin or store owner
    if (requestingUserRole !== UserRole.ADMIN && store.owner.id !== requestingUserId) {
      throw new ForbiddenException('You can only delete your own stores');
    }

    await this.storeRepository.remove(store);
  }
}
