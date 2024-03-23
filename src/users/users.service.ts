import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashedPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = this.getHashedPassword(createUserDto.password);

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...result } = user.toJSON();
    return result;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id });
      const { password, ...result } = user.toJSON();
      return result;
    } catch (error) {
      return 'User not found';
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateUserDto,
      },
    );
    return user;
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({ _id: id });
    } catch (error) {
      return 'User not found';
    }
  }
}
