import { UserRole } from '../user.entity';
export declare enum UserSortBy {
    NAME = "name",
    EMAIL = "email",
    ADDRESS = "address",
    ROLE = "role",
    CREATED_AT = "createdAt"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class FilterUsersDto {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
    sortBy?: UserSortBy;
    sortOrder?: SortOrder;
}
