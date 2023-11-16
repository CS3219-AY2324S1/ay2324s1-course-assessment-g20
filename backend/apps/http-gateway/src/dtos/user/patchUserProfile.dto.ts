import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsAlphanumeric,
} from 'class-validator';

export default class PatchUserProfileDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  preferredLanguageId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;
}
