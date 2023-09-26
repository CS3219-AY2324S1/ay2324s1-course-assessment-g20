import { IsMongoId, IsString } from 'class-validator';

export class DifficultyDto {
  @IsMongoId()
  id: string;

  @IsString()
  name: string;
}
