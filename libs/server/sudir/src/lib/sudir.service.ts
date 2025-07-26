import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { generateSudirPoW } from './util/generateSudirPoW';

@Injectable()
export class SudirService {
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
  ) {}

  public async generateSudirPoW(input: string): Promise<string> {
    return generateSudirPoW(input);
  }
}
