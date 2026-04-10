import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { User, UserRole } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createRatingDto: CreateRatingDto, userId: number, storeId: number): Promise<Rating> {
    const { rating } = createRatingDto;

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify store exists
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if user has already rated this store
    const existingRating = await this.ratingRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this store');
    }

    // Create new rating
    const newRating = this.ratingRepository.create({
      rating,
      user,
      store,
    });

    return this.ratingRepository.save(newRating);
  }

  async update(createRatingDto: CreateRatingDto, userId: number, storeId: number): Promise<Rating> {
    const { rating } = createRatingDto;

    // Find existing rating
    const existingRating = await this.ratingRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
      relations: ['user', 'store'],
    });

    if (!existingRating) {
      throw new NotFoundException('Rating not found');
    }

    // Update rating
    existingRating.rating = rating;
    return this.ratingRepository.save(existingRating);
  }

  async findByStore(storeId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { store: { id: storeId } },
      relations: ['user'],
    });
  }

  async findByUser(userId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { user: { id: userId } },
      relations: ['store'],
    });
  }

  async findOne(userId: number, storeId: number): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
      relations: ['user', 'store'],
    });
  }

  async remove(userId: number, storeId: number, requestingUserId: number, requestingUserRole: UserRole): Promise<void> {
    const rating = await this.ratingRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
      relations: ['user'],
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    // Check if user is admin or the rating owner
    if (requestingUserRole !== UserRole.ADMIN && rating.user.id !== requestingUserId) {
      throw new ForbiddenException('You can only delete your own ratings');
    }

    await this.ratingRepository.remove(rating);
  }

  async getStoreRatingStats(storeId: number): Promise<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const ratings = await this.ratingRepository.find({
      where: { store: { id: storeId } },
    });

    const totalRatings = ratings.length;
    let averageRating = 0;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (totalRatings > 0) {
      const totalRatingValue = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      averageRating = totalRatingValue / totalRatings;

      ratings.forEach(rating => {
        ratingDistribution[rating.rating]++;
      });
    }

    return {
      averageRating,
      totalRatings,
      ratingDistribution,
    };
  }
}
