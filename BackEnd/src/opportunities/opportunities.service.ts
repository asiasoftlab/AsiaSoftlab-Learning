import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunitiesRepository } from './opportunities.repository';
import { Opportunity } from './entities/opportunity.entity';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly opportunitiesRepository: OpportunitiesRepository) {}

  async create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    return this.opportunitiesRepository.create(createOpportunityDto);
  }

  async findAll(): Promise<Opportunity[]> {
    return this.opportunitiesRepository.findAll();
  }

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunitiesRepository.findOne(id);
    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }
    return opportunity;
  }

  async update(id: string, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity> {
    const updated = await this.opportunitiesRepository.update(id, updateOpportunityDto);
    if (!updated) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const opportunity = await this.opportunitiesRepository.findOne(id);
    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID ${id} not found`);
    }
    return this.opportunitiesRepository.remove(id);
  }
}
