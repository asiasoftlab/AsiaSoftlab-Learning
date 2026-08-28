import { Module } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesRepository } from './opportunities.repository';
import { FirebaseModule } from '../firebase/firebase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [FirebaseModule, UsersModule],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, OpportunitiesRepository],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
