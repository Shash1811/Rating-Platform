import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user.entity';

export enum UserSortBy {
  NAME = 'name',
  EMAIL = 'email',
  ADDRESS = 'address',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterUsersDto {
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
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserSortBy)
  sortBy?: UserSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
