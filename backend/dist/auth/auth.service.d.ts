import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: Omit<User, 'password'>;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: Omit<User, 'password'>;
    }>;
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void>;
    validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null>;
}
