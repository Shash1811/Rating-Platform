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
exports.RatingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ratings_service_1 = require("./ratings.service");
const create_rating_dto_1 = require("./dto/create-rating.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/user.entity");
let RatingsController = class RatingsController {
    constructor(ratingsService) {
        this.ratingsService = ratingsService;
    }
    create(createRatingDto, storeId, req) {
        return this.ratingsService.create(createRatingDto, req.user.id, +storeId);
    }
    update(createRatingDto, storeId, req) {
        return this.ratingsService.update(createRatingDto, req.user.id, +storeId);
    }
    findByStore(storeId) {
        return this.ratingsService.findByStore(+storeId);
    }
    getStoreStats(storeId) {
        return this.ratingsService.getStoreRatingStats(+storeId);
    }
    findMyRatings(req) {
        return this.ratingsService.findByUser(req.user.id);
    }
    findMyRating(storeId, req) {
        return this.ratingsService.findOne(req.user.id, +storeId);
    }
    remove(storeId, req) {
        return this.ratingsService.remove(req.user.id, +storeId, req.user.id, req.user.role);
    }
};
exports.RatingsController = RatingsController;
__decorate([
    (0, common_1.Post)('stores/:storeId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.NORMAL_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a rating for a store (Normal User only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rating successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User has already rated this store' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Normal User access required' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rating_dto_1.CreateRatingDto, String, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('stores/:storeId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.NORMAL_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a rating for a store (Normal User only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rating not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Normal User access required' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rating_dto_1.CreateRatingDto, String, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('stores/:storeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ratings for a store' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ratings retrieved successfully' }),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "findByStore", null);
__decorate([
    (0, common_1.Get)('stores/:storeId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rating statistics for a store' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating statistics retrieved successfully' }),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "getStoreStats", null);
__decorate([
    (0, common_1.Get)('my-ratings'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.NORMAL_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ratings by current user (Normal User only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ratings retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Normal User access required' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "findMyRatings", null);
__decorate([
    (0, common_1.Get)('my-ratings/stores/:storeId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.NORMAL_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user rating for a specific store (Normal User only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Normal User access required' }),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "findMyRating", null);
__decorate([
    (0, common_1.Delete)('stores/:storeId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.NORMAL_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a rating (Admin or Rating Owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rating not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Insufficient permissions' }),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "remove", null);
exports.RatingsController = RatingsController = __decorate([
    (0, swagger_1.ApiTags)('Ratings'),
    (0, common_1.Controller)('ratings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ratings_service_1.RatingsService])
], RatingsController);
//# sourceMappingURL=ratings.controller.js.map