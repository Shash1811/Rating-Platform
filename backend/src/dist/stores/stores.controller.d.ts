import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoresDto } from './dto/filter-stores.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    create(createStoreDto: CreateStoreDto): Promise<import("./store.entity").Store>;
    findAll(filters: FilterStoresDto): Promise<import("./store.entity").Store[]>;
    findMyStores(req: any): Promise<import("./store.entity").Store[]>;
    findOne(id: string): Promise<import("./store.entity").Store>;
    remove(id: string, req: any): Promise<void>;
}
