import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';
export declare class Store {
    id: number;
    name: string;
    email: string;
    address: string;
    owner: User;
    ratings: Rating[];
    createdAt: Date;
    updatedAt: Date;
}
