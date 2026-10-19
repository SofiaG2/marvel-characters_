import {IsString, IsNotEmpty, IsInt, Min, Max, IsIn, IsBoolean, IsOptional, ValidateIf, MaxLength } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  real_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alias: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  main_power: string;

  @IsInt()
  @Min(1)
  @Max(100)
  power_level: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsIn(['ACTIVE', 'INJURED', 'MISSING', 'RETIRED'])
  status?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  is_villain?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  team_id?: number | null;
}
