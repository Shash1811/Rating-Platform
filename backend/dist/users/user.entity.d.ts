import { Rating } from '../ratings/rating.entity';
import { Store } from '../stores/store.entity';
export declare enum UserRole {
    ADMIN = "admin",
    NORMAL_USER = "normal_user",
    STORE_OWNER = "store_owner"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
    stores: Store[];
    ratings: Rating[];
    createdAt: Date;
    updatedAt: Date;
}
