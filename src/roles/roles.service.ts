import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/users.interface';
import { Permission } from '../permissions/schemas/permission.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isExist = await this.roleModel.findOne({
      name: createRoleDto.name,
    });
    if (isExist) {
      throw new BadRequestException('Role already exists');
    }

    const newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, query: string) {
    const { filter, sort, population } = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        currentPage, //trang hiện tại
        pageSize: defaultLimit, //số lượng phần tử trên 1 trang
        totalPages, //tổng số trang
        totalItems, //tổng số phần tử
      },
      result,
    };
  }

  async findOne(id: string) {
    try {
      const role = await this.roleModel.findById(id);
      return role.populate({
        path: Permission.name,
        select: {
          _id: 1,
          name: 1,
          apiPath: 1,
          method: 1,
        },
      });
    } catch (error) {
      return 'Role not found';
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    // const isExist = await this.roleModel.findOne({
    //   name: updateRoleDto.name,
    // });
    // if (isExist) {
    //   throw new BadRequestException('Role already exists');
    // }

    const role = await this.roleModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return role;
  }

  async remove(id: string, user: IUser) {
    try {
      const foundRole = await this.roleModel.findById(id);
      if (foundRole.name === 'ADMIN') {
        throw new BadRequestException('Cannot delete admin role');
      }
      await this.roleModel.updateOne(
        {
          _id: id,
        },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
      return await this.roleModel.softDelete({ _id: id });
    } catch (error) {
      return 'Role not found';
    }
  }
}
