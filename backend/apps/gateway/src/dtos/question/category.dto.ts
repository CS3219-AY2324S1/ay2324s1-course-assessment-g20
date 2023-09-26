import { IsMongoId, IsString } from 'class-validator';

export class CategoryDto {
  @IsMongoId()
  id: string;

  @IsString()
  name: string;
}
