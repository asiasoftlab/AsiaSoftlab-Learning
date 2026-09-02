import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification: Notification = {
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      type: createNotificationDto.type || 'info',
    };
    return this.notificationsRepository.create(notification);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationsRepository.findAll();
  }

  async remove(id: string): Promise<void> {
    return this.notificationsRepository.remove(id);
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<void> {
    return this.notificationsRepository.update(id, updateNotificationDto as any);
  }
}
