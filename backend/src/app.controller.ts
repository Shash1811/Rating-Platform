import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Rating Platform API is running',
      docs: '/api',
      endpoints: ['/auth', '/users', '/stores', '/ratings'],
    };
  }
}
