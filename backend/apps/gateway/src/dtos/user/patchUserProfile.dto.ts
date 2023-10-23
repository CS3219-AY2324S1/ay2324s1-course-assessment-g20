import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export default class PatchUserProfileDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  preferredLanguageId: number;

  @IsOptional()
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username: string;
}
