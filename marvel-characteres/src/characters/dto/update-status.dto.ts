import {IsIn} from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['ACTIVE', 'INJURED', 'MISSING', 'RETIRED'])
  status: string;
}