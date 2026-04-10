import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { User, UserRole } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
export declare class RatingsService {
    private ratingRepository;
    private userRepository;
    private storeRepository;
    constructor(ratingRepository: Repository<Rating>, userRepository: Repository<User>, storeRepository: Repository<Store>);
    create(createRatingDto: CreateRatingDto, userId: number, storeId: number): Promise<Rating>;
    update(createRatingDto: CreateRatingDto, userId: number, storeId: number): Promise<Rating>;
    findByStore(storeId: number): Promise<Rating[]>;
    findByUser(userId: number): Promise<Rating[]>;
    findOne(userId: number, storeId: number): Promise<Rating | null>;
    remove(userId: number, storeId: number, requestingUserId: number, requestingUserRole: UserRole): Promise<void>;
    getStoreRatingStats(storeId: number): Promise<{
        averageRating: number;
        totalRatings: number;
        ratingDistribution: {
            [key: number]: number;
        };
    }>;
}
