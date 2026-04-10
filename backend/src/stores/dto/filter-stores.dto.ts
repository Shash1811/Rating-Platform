import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum StoreSortBy {
  NAME = 'name',
  EMAIL = 'email',
  ADDRESS = 'address',
  CREATED_AT = 'createdAt',
  AVERAGE_RATING = 'averageRating',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterStoresDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(StoreSortBy)
  sortBy?: StoreSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
