import {
  Controller,
  Get,
  Redirect,
  Post,
  HttpCode,
  Body,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

import { AppService } from '../app.service';
import { AddDto } from '../dtos/add.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'server counter increased', type: Number })
  increase() {
    return this.appService.increase();
  }

  @Post()
  @HttpCode(200)
  @ApiOkResponse({ description: 'the sum of given x and y', type: Number })
  add(@Body() { x, y }: AddDto) {
    return this.appService.sum(x, y);
  }

  @Get('nestjs')
  @Redirect('https://docs.nestjs.com')
  @ApiResponse({ status: 302, description: 'nestjs docs site' })
  docs() {
    return;
  }
}

