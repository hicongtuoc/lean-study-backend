import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Version 1.0.0 - Update: 08-04-2024 00:30 AM - Author: Lê Đăng Long';
  }
}
