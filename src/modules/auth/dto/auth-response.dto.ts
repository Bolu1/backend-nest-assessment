import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';

@ObjectType()
export class AuthResponseDto {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
