import { Response } from 'express';

import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('/')
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  site(@Res() res: Response) {
    return res
      .status(301)
      .redirect(this.configService.get<string>('SITE_URL') as string);
  }
}
