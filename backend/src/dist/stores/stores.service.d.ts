import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { User, UserRole } from '../users/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoresDto } from './dto/filter-stores.dto';
export declare class StoresService {
    private storeRepository;
    private userRepository;
    constructor(storeRepository: Repository<Store>, userRepository: Repository<User>);
    create(createStoreDto: CreateStoreDto): Promise<Store>;
    findAll(filters: FilterStoresDto): Promise<Store[]>;
    findOne(id: number): Promise<Store>;
    findByOwner(ownerId: number): Promise<Store[]>;
    remove(id: number, requestingUserId: number, requestingUserRole: UserRole): Promise<void>;
}
