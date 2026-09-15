import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateSubscriberStatusDto {
  @IsNotEmpty()
  @IsIn(['active', 'unsubscribed'])
  status: 'active' | 'unsubscribed';
}
