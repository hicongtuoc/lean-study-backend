import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'isActive is required' })
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive: boolean;

  @IsNotEmpty({ message: 'Permission is required' })
  @IsMongoId({ message: 'Permission must be a valid mongo ObjectId' })
  @IsArray({ message: 'Permission must be an array' })
  permission: mongoose.Schema.Types.ObjectId[];
}
