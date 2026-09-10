import { Controller, Get, Param, UseGuards, Patch, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';


@Controller('users')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles('admin')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @Roles('admin')
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    await this.usersService.updateRole(id, updateRoleDto.role);
    return { success: true, message: 'Role updated successfully' };
  }


  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { success: true, message: 'User deleted successfully' };
  }
}
