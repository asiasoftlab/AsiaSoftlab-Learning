import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'instructor')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    // Parse the multipart form data
    const createCourseDto: CreateCourseDto = {
      title: body.title,
      description: body.description,
      category: body.category,
      level: body.level,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      status: body.status,
      instructorId: body.instructorId || (req.user?.id || req.user?.uid),
      lessons: body.lessons ? JSON.parse(body.lessons) : [],
    };

    if (!file) {
      throw new BadRequestException('Thumbnail image is required');
    }

    return this.coursesService.createWithThumbnail(createCourseDto, file);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'instructor')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const updateCourseDto: UpdateCourseDto = { ...body };
    if (body.price) updateCourseDto.price = Number(body.price);
    if (body.originalPrice) updateCourseDto.originalPrice = Number(body.originalPrice);
    if (body.lessons) updateCourseDto.lessons = JSON.parse(body.lessons);

    if (file) {
      return this.coursesService.updateWithThumbnail(id, updateCourseDto, file);
    }
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'instructor')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}

