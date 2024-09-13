import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserInfoInJwt } from '../auth/interfaces/jwt';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  // Get the current user's details using their ID from the JWT
  @UseGuards(GqlAuthGuard) // Protect this query with an authentication guard
  @Query(() => User)
  async getMe(@CurrentUser() user: UserInfoInJwt) {
    return this.userService.findById(user.userId);
  }
}
