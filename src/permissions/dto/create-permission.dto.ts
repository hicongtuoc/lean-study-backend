import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'API path is required' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method is required' })
  method: string;

  @IsNotEmpty({ message: 'Module is required' })
  mudole: string;
}
