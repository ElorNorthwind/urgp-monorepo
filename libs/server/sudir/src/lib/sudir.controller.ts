import { Controller, Get, Param, Query } from '@nestjs/common';
import { SudirService } from './sudir.service';

@Controller('sudir')
export class SudirController {
  constructor(private readonly sudir: SudirService) {}

  @Get('pow/:input')
  async getPow(@Param('input') input: string) {
    return this.sudir.generateSudirPoW(input);
  }

  @Get('edo/login')
  async loginEdo(
    @Query('login')
    login: string,
    @Query('password')
    password: string,
  ) {
    return this.sudir.loginEdo(login, password);
  }

  @Get('edo/master-login')
  async loginMasterEdo() {
    return this.sudir.loginMasterEdo;
  }
}
