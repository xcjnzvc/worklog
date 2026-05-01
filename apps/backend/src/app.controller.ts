import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  health() {
    console.log('연결됨');
    return { status: 'ok' };
  }
}
