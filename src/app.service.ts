import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Version 1.0.0 - Update: 07-04-2024 11:00 AM - Author: Lê Đăng Long';
  }
}
