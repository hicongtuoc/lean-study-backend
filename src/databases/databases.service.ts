import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { INIT_PERMISSIONS } from './sample';
import { ADMIN_ROLE, USER_ROLE } from 'src/consts';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      const countRole = await this.roleModel.count({});
      const countPermission = await this.permissionModel.count({});

      //create permission
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
        // bulk create
      }

      //create role
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Quản trị hệ thống full quyền',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Người dùng sử dụng hệ thống',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      //create user
      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });

        await this.userModel.insertMany([
          {
            name: 'Quản trị viên hệ thống',
            email: 'admin@fotusoft.com',
            password: await this.usersService.getHashedPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            gender: 'MALE',
            address: 'Hà Nội',
            role: adminRole._id,
          },
          {
            name: 'Lê Đăng Long',
            email: 'longld@fotusoft.com',
            password: await this.usersService.getHashedPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            gender: 'MALE',
            address: 'Hà Nội',
            role: userRole._id,
          },
        ]);
      }

      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        this.logger.log('Data has been initialized');
      }
    }
  }
}
