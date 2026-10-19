import {IsArray, ArrayNotEmpty, IsInt} from 'class-validator';

export class AssignCharactersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  characterIds: number[];
}
