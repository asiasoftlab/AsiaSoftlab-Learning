import { Module } from '@nestjs/common';
// Import the storage service
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
