import {
  Controller,
  Get,
  Header,
  Logger,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import { DtwService } from './dtw.service';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Controller('dtw')
// @UseGuards(AccessTokenGuard)
export class DtwController {
  constructor(private readonly dtw: DtwService) {}

  @Get('tile/:z/:x/:y')
  // @Header('Content-Type', 'image/jpeg')
  // @Header('Content-Type', 'application/octet-stream')
  async getDwtTilwe(
    @Param('z', ParseIntPipe) z: number,
    @Param('x', ParseIntPipe) x: number,
    @Param('y', ParseIntPipe) y: number,
    @Res() res: any,
  ): Promise<any> {
    const tileStream$: Observable<any> = await this.dtw.getDtwMapTileStream({
      z,
      x,
      y,
    });

    return tileStream$.pipe(
      catchError((error) => {
        return of(error);
      }),
      map((response) => {
        if (response?.status !== 200) {
          res.set({
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=3600',
          });
          res.send(this.dtw.blackImageBuffer);
        } else {
          res.set({
            'Content-Type': 'image/jpeg',
            'Content-Length': response?.headers?.['content-length'],
            'Cache-Control': 'public, max-age=3600',
          });
          res.send(response.data);
        }
      }),
    );
  }
  @Get('login')
  getDwtLogin(): Promise<any> {
    return this.dtw.getDwtToken();
  }

  // @Get('refresh/:token')
  // getDwtRefresh(@Param('token') token: string): Promise<any> {
  //   return this.dtw.DtwRefresh(token);
  // }
}
