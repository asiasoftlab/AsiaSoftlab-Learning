import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Opportunity } from './entities/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Injectable()
export class OpportunitiesRepository {
  private readonly collectionName = 'opportunities';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createOpportunityDto: CreateOpportunityDto): Promise<Opportunity> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc();
      
      const opportunity: Opportunity = {
        id: docRef.id,
        ...createOpportunityDto,
        status: createOpportunityDto.status || 'Open',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await docRef.set({
        ...opportunity,
        createdAt: opportunity.createdAt,
        updatedAt: opportunity.updatedAt,
      });

      return opportunity;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create opportunity in database');
    }
  }

  async findAll(): Promise<Opportunity[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data?.title,
          description: data?.description,
          company: data?.company,
          location: data?.location,
          type: data?.type,
          applyLink: data?.applyLink,
          status: data?.status,
          createdAt: data?.createdAt?.toDate(),
          updatedAt: data?.updatedAt?.toDate(),
        } as Opportunity;
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve opportunities');
    }
  }

  async findOne(id: string): Promise<Opportunity | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data();
      return {
        id: doc.id,
        title: data?.title,
        description: data?.description,
        company: data?.company,
        location: data?.location,
        type: data?.type,
        applyLink: data?.applyLink,
        status: data?.status,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as Opportunity;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve opportunity');
    }
  }

  async update(id: string, updateOpportunityDto: UpdateOpportunityDto): Promise<Opportunity | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc(id);
      
      const doc = await docRef.get();
      if (!doc.exists) {
        return null;
      }

      const updateData = {
        ...updateOpportunityDto,
        updatedAt: new Date(),
      };

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();
      return {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as Opportunity;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update opportunity');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete opportunity');
    }
  }
}
