import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.usersRepository.create(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async updateRole(id: string, role: string): Promise<void> {
    return this.usersRepository.updateRole(id, role);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }
}
