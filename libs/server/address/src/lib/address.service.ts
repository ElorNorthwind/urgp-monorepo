import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import {
  AddressSessionFull,
  FIAS_CONCURRENCY,
  FIAS_DB_STEP,
  FIAS_TIMEOUT,
} from '@urgp/shared/entities';
import { FiasService } from 'libs/server/fias/src/lib/fias.service';
import {
  catchError,
  from,
  lastValueFrom,
  map,
  mergeMap,
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

  public async getFiasDailyUsage(): Promise<number> {
    return this.dbServise.db.address.getFiasDailyUsage();
  }

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

  public async hydrateSessionAdresses(sessionId: number, limit = FIAS_DB_STEP) {
    try {
      let addresses = [];
      do {
        this.dbServise.db.address.updateSession({
          id: sessionId,
          status: 'running',
        });

        addresses =
          await this.dbServise.db.address.getSessionUnfinishedAddresses(
            sessionId,
            limit,
          );
        const hydratedData = from(addresses).pipe(
          mergeMap((arg, index) =>
            timer(FIAS_TIMEOUT * index).pipe(
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
                        source: 'fias-search',
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
                        source: 'fias-search',
                      }),
                    ),
                  ),
                FIAS_CONCURRENCY,
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
        status: 'done',
      });
    } catch {
      this.dbServise.db.address.updateSession({
        id: sessionId,
        isDone: true,
        isError: true,
        status: 'paused',
      });
      (e: any) => Logger.error(e);
    }
  }
}
