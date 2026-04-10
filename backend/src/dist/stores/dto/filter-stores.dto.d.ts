export declare enum StoreSortBy {
    NAME = "name",
    EMAIL = "email",
    ADDRESS = "address",
    CREATED_AT = "createdAt",
    AVERAGE_RATING = "averageRating"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class FilterStoresDto {
    name?: string;
    email?: string;
    address?: string;
    sortBy?: StoreSortBy;
    sortOrder?: SortOrder;
}
