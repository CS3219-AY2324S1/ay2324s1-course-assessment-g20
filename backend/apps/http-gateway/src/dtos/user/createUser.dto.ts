import { IsString, IsOptional } from 'class-validator';

export default class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;
}
