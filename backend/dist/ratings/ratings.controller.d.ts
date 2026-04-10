import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    create(createRatingDto: CreateRatingDto, storeId: string, req: any): Promise<import("./rating.entity").Rating>;
    update(createRatingDto: CreateRatingDto, storeId: string, req: any): Promise<import("./rating.entity").Rating>;
    findByStore(storeId: string): Promise<import("./rating.entity").Rating[]>;
    getStoreStats(storeId: string): Promise<{
        averageRating: number;
        totalRatings: number;
        ratingDistribution: {
            [key: number]: number;
        };
    }>;
    findMyRatings(req: any): Promise<import("./rating.entity").Rating[]>;
    findMyRating(storeId: string, req: any): Promise<import("./rating.entity").Rating>;
    remove(storeId: string, req: any): Promise<void>;
}
