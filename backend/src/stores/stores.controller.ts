import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoresDto } from './dto/filter-stores.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Stores')
@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new store (Admin only)' })
  @ApiResponse({ status: 201, description: 'Store successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores with filters' })
  @ApiResponse({ status: 200, description: 'Stores retrieved successfully' })
  findAll(@Query() filters: FilterStoresDto) {
    return this.storesService.findAll(filters);
  }

  @Get('my-stores')
  @Roles(UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Get stores owned by current user (Store Owner only)' })
  @ApiResponse({ status: 200, description: 'Stores retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Store Owner access required' })
  findMyStores(@Request() req) {
    return this.storesService.findByOwner(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Store retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Delete store (Admin or Store Owner only)' })
  @ApiResponse({ status: 200, description: 'Store successfully deleted' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  remove(@Param('id') id: string, @Request() req) {
    return this.storesService.remove(+id, req.user.id, req.user.role);
  }
}
