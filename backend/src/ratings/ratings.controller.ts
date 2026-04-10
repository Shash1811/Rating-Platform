import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Ratings')
@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post('stores/:storeId')
  @Roles(UserRole.NORMAL_USER)
  @ApiOperation({ summary: 'Create a rating for a store (Normal User only)' })
  @ApiResponse({ status: 201, description: 'Rating successfully created' })
  @ApiResponse({ status: 409, description: 'User has already rated this store' })
  @ApiResponse({ status: 403, description: 'Forbidden - Normal User access required' })
  create(
    @Body() createRatingDto: CreateRatingDto,
    @Param('storeId') storeId: string,
    @Request() req,
  ) {
    return this.ratingsService.create(createRatingDto, req.user.id, +storeId);
  }

  @Put('stores/:storeId')
  @Roles(UserRole.NORMAL_USER)
  @ApiOperation({ summary: 'Update a rating for a store (Normal User only)' })
  @ApiResponse({ status: 200, description: 'Rating successfully updated' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Normal User access required' })
  update(
    @Body() createRatingDto: CreateRatingDto,
    @Param('storeId') storeId: string,
    @Request() req,
  ) {
    return this.ratingsService.update(createRatingDto, req.user.id, +storeId);
  }

  @Get('stores/:storeId')
  @ApiOperation({ summary: 'Get all ratings for a store' })
  @ApiResponse({ status: 200, description: 'Ratings retrieved successfully' })
  findByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findByStore(+storeId);
  }

  @Get('stores/:storeId/stats')
  @ApiOperation({ summary: 'Get rating statistics for a store' })
  @ApiResponse({ status: 200, description: 'Rating statistics retrieved successfully' })
  getStoreStats(@Param('storeId') storeId: string) {
    return this.ratingsService.getStoreRatingStats(+storeId);
  }

  @Get('my-ratings')
  @Roles(UserRole.NORMAL_USER)
  @ApiOperation({ summary: 'Get all ratings by current user (Normal User only)' })
  @ApiResponse({ status: 200, description: 'Ratings retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Normal User access required' })
  findMyRatings(@Request() req) {
    return this.ratingsService.findByUser(req.user.id);
  }

  @Get('my-ratings/stores/:storeId')
  @Roles(UserRole.NORMAL_USER)
  @ApiOperation({ summary: 'Get current user rating for a specific store (Normal User only)' })
  @ApiResponse({ status: 200, description: 'Rating retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Normal User access required' })
  findMyRating(@Param('storeId') storeId: string, @Request() req) {
    return this.ratingsService.findOne(req.user.id, +storeId);
  }

  @Delete('stores/:storeId')
  @Roles(UserRole.ADMIN, UserRole.NORMAL_USER)
  @ApiOperation({ summary: 'Delete a rating (Admin or Rating Owner only)' })
  @ApiResponse({ status: 200, description: 'Rating successfully deleted' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  remove(@Param('storeId') storeId: string, @Request() req) {
    return this.ratingsService.remove(req.user.id, +storeId, req.user.id, req.user.role);
  }
}
