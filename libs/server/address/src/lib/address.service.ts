import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { AddressSessionFull } from '@urgp/shared/entities';
import { add } from 'date-fns';
import { FiasService } from 'libs/server/fias/src/lib/fias.service';
import {
  catchError,
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  mergeMap,
  NotFoundError,
  Observable,
  of,
  timer,
  toArray,
} from 'rxjs';

@Injectable()
export class AddressService {
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
    private fias: FiasService,
  ) {}

  public async addSessionAddresses(
    addresses: string[],
    sessionId: number,
  ): Promise<AddressSessionFull | null> {
    await this.dbServise.db.address.insertSessionAddresses(
      addresses,
      sessionId,
    );
    return this.dbServise.db.address.getSessionById(sessionId);
  }

  public async hydrateSessionAdresses(sessionId: number, limit = 50) {
    try {
      let addresses = [];
      do {
        addresses =
          await this.dbServise.db.address.readSessionUnfinishedAddresses(
            sessionId,
            limit,
          );
        const hydratedData = from(addresses).pipe(
          mergeMap((arg, index) =>
            timer(100 * index).pipe(
              mergeMap(
                () =>
                  from(this.fias.getAddress(arg.address)).pipe(
                    map((value) => {
                      if (value?.object_id < 0)
                        throw new NotFoundException('Адрес не найден');
                      return {
                        id: arg.id,
                        status: 'success' as const,
                        value,
                        error: null,
                      };
                    }),
                    catchError((error) =>
                      of({
                        id: arg.id,
                        status: 'error' as const,
                        value: {
                          ...FiasService.emptyAddress,
                          full_name: error.message,
                        },
                        error: error.message,
                      }),
                    ),
                  ),
                4, // Run up to 4 requests in parallel
              ),
            ),
          ),
          toArray(),
        );
        this.dbServise.db.address.updateAddressResult(
          await lastValueFrom(hydratedData),
        );
      } while (addresses?.length > 0);

      this.dbServise.db.address.updateSession({
        id: sessionId,
        isDone: true,
        isError: false,
      });
    } catch {
      this.dbServise.db.address.updateSession({
        id: sessionId,
        isDone: true,
        isError: true,
      });
      (e: any) => Logger.error(e);
    }
  }
}
