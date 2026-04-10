import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
export declare class Rating {
    id: number;
    rating: number;
    user: User;
    store: Store;
    createdAt: Date;
    updatedAt: Date;
}
