"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./rating.entity");
const user_entity_1 = require("../users/user.entity");
const store_entity_1 = require("../stores/store.entity");
let RatingsService = class RatingsService {
    constructor(ratingRepository, userRepository, storeRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
    }
    async create(createRatingDto, userId, storeId) {
        const { rating } = createRatingDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const store = await this.storeRepository.findOne({ where: { id: storeId } });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        const existingRating = await this.ratingRepository.findOne({
            where: { user: { id: userId }, store: { id: storeId } },
        });
        if (existingRating) {
            throw new common_1.ConflictException('You have already rated this store');
        }
        const newRating = this.ratingRepository.create({
            rating,
            user,
            store,
        });
        return this.ratingRepository.save(newRating);
    }
    async update(createRatingDto, userId, storeId) {
        const { rating } = createRatingDto;
        const existingRating = await this.ratingRepository.findOne({
            where: { user: { id: userId }, store: { id: storeId } },
            relations: ['user', 'store'],
        });
        if (!existingRating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        existingRating.rating = rating;
        return this.ratingRepository.save(existingRating);
    }
    async findByStore(storeId) {
        return this.ratingRepository.find({
            where: { store: { id: storeId } },
            relations: ['user'],
        });
    }
    async findByUser(userId) {
        return this.ratingRepository.find({
            where: { user: { id: userId } },
            relations: ['store'],
        });
    }
    async findOne(userId, storeId) {
        return this.ratingRepository.findOne({
            where: { user: { id: userId }, store: { id: storeId } },
            relations: ['user', 'store'],
        });
    }
    async remove(userId, storeId, requestingUserId, requestingUserRole) {
        const rating = await this.ratingRepository.findOne({
            where: { user: { id: userId }, store: { id: storeId } },
            relations: ['user'],
        });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        if (requestingUserRole !== user_entity_1.UserRole.ADMIN && rating.user.id !== requestingUserId) {
            throw new common_1.ForbiddenException('You can only delete your own ratings');
        }
        await this.ratingRepository.remove(rating);
    }
    async getStoreRatingStats(storeId) {
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
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map