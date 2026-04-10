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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./store.entity");
const user_entity_1 = require("../users/user.entity");
const filter_stores_dto_1 = require("./dto/filter-stores.dto");
let StoresService = class StoresService {
    constructor(storeRepository, userRepository) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }
    async create(createStoreDto) {
        const { name, email, address, ownerId } = createStoreDto;
        const existingStore = await this.storeRepository.findOne({ where: { email } });
        if (existingStore) {
            throw new common_1.ConflictException('Store with this email already exists');
        }
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!owner) {
            throw new common_1.NotFoundException('Owner not found');
        }
        if (owner.role !== user_entity_1.UserRole.STORE_OWNER) {
            throw new common_1.ForbiddenException('Only store owners can own stores');
        }
        const store = this.storeRepository.create({
            name,
            email,
            address,
            owner,
        });
        return this.storeRepository.save(store);
    }
    async findAll(filters) {
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
        const sortBy = filters.sortBy ?? filter_stores_dto_1.StoreSortBy.NAME;
        const sortOrder = (filters.sortOrder ?? filter_stores_dto_1.SortOrder.ASC).toUpperCase();
        if (sortBy !== filter_stores_dto_1.StoreSortBy.AVERAGE_RATING) {
            queryBuilder.orderBy(`store.${sortBy}`, sortOrder);
        }
        const stores = await queryBuilder.getMany();
        const storesWithRatings = stores.map(store => {
            const storeWithRating = { ...store };
            if (store.ratings && store.ratings.length > 0) {
                const totalRating = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
                storeWithRating['averageRating'] = totalRating / store.ratings.length;
            }
            else {
                storeWithRating['averageRating'] = 0;
            }
            return storeWithRating;
        });
        if (sortBy === filter_stores_dto_1.StoreSortBy.AVERAGE_RATING) {
            storesWithRatings.sort((a, b) => {
                const aRating = a.averageRating ?? 0;
                const bRating = b.averageRating ?? 0;
                return sortOrder === 'ASC' ? aRating - bRating : bRating - aRating;
            });
        }
        return storesWithRatings;
    }
    async findOne(id) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['owner', 'ratings', 'ratings.user'],
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        if (store.ratings && store.ratings.length > 0) {
            const totalRating = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
            store.averageRating = totalRating / store.ratings.length;
        }
        else {
            store.averageRating = 0;
        }
        return store;
    }
    async findByOwner(ownerId) {
        const stores = await this.storeRepository.find({
            where: { owner: { id: ownerId } },
            relations: ['ratings', 'ratings.user'],
        });
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
            }
            else {
                storeWithRating['averageRating'] = 0;
                storeWithRating['ratingUsers'] = [];
            }
            return storeWithRating;
        });
    }
    async remove(id, requestingUserId, requestingUserRole) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        if (requestingUserRole !== user_entity_1.UserRole.ADMIN && store.owner.id !== requestingUserId) {
            throw new common_1.ForbiddenException('You can only delete your own stores');
        }
        await this.storeRepository.remove(store);
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map