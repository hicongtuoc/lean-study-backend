import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashedPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = this.getHashedPassword(createUserDto.password);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    const { password, ...result } = newUser.toJSON();
    return result;
  }

  async register(registerUserDto: RegisterUserDto) {
    const userExist = await this.userModel.findOne({
      email: registerUserDto.email,
    });

    if (userExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = this.getHashedPassword(registerUserDto.password);

    const user = await this.userModel.create({
      ...registerUserDto,
      password: hashedPassword,
      role: 'USER',
    });

    const { password, ...result } = user.toJSON();
    return result;
  }

  async findAll(currentPage: number, limit: number, query: string) {
    const { filter, sort, population } = aqp(query);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
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
      const user = await this.userModel
        .findOne({ _id: id })
        .select('-password');
      return user;
    } catch (error) {
      return 'User not found';
    }
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const currentUser = await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return currentUser;
  }

  // TODO: loại bỏ thư viện soft-delete-plugin-mongoose
  async remove(id: string, user: IUser) {
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
      return await this.userModel.softDelete({ _id: id });
    } catch (error) {
      return 'User not found';
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.userModel.updateOne(
      { _id: userId },
      {
        refreshToken,
      },
    );
  }

  async findUserByToken(refreshToken: string) {
    return await this.userModel.findOne({
      refreshToken,
    });
  }
}
