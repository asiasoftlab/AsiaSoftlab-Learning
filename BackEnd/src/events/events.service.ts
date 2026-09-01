import { Injectable } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event: Event = {
      title: createEventDto.title,
      date: createEventDto.date,
      time: createEventDto.time,
      type: createEventDto.type,
    };
    return this.eventsRepository.create(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.findAll();
  }

  async update(id: string, updateData: Partial<Event>): Promise<Event> {
    return this.eventsRepository.update(id, updateData);
  }

  async remove(id: string): Promise<void> {
    return this.eventsRepository.remove(id);
  }
}
