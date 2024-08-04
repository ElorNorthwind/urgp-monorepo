import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@urgp/shared/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login', passwordFiled: 'password' });
  }

  async validate(login: string, password: string): Promise<User> {
    return await this.authService.validateUser({ login, password });
  }
}
