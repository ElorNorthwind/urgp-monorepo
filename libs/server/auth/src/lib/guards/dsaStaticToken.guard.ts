import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DsaStaticTokenGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = (request.headers as any)?.['authorization'] || '';

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const isValid = await this.validateToken(token);
      if (!isValid) {
        throw new UnauthorizedException('Invalid token');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async validateToken(token: string): Promise<boolean> {
    const dsaStaticToken =
      await this.configService.get<string>('DSA_DGI_API_TOKEN');
    return token === dsaStaticToken;
  }
}
