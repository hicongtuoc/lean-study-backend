import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Permission created successfully')
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Permissions fetched successfully')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() query: string,
  ) {
    return this.permissionsService.findAll(+currentPage, +limit, query);
  }

  @Get(':id')
  @ResponseMessage('Permission fetched successfully')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Permission deleted successfully')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
