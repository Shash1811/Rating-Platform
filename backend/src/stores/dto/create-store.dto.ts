import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ownerId: number;
}
