import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';

@Injectable()
export class AddressService {
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
  ) {}
}
