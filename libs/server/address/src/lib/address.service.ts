import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import {
  addressNotFoundParsedToResult,
  AddressReslutUpdate,
  AddressSessionFull,
  FIAS_CONCURRENCY,
  FIAS_DB_STEP,
  FiasAddressWithDetails,
  addressToParts,
  RatesDailyUsage,
  FIAS_TIMEOUT,
  FIAS_REQUESTS_PER_SECOND,
} from '@urgp/shared/entities';
import { FiasService } from 'libs/server/fias/src/lib/fias.service';
import {
  catchError,
  from,
  interval,
  lastValueFrom,
  map,
  mergeMap,
  of,
  startWith,
  tap,
  throttle,
  toArray,
  zip,
} from 'rxjs';
import { formatFiasDataForDb } from './helper/formatFiasDataForDb';
import { AddressSessionsService } from './address-sessions.service';

@Injectable()
export class AddressService {
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
    private fias: FiasService,
  ) {}

  public async getFiasDailyUsage(): Promise<RatesDailyUsage> {
    return this.dbServise.db.address.getRatesDailyUsage();
  }

  public async addSessionAddresses(
    addresses: string[],
    sessionId: number,
    listIndex?: number,
  ): Promise<AddressSessionFull | null> {
    await this.dbServise.db.address.insertSessionAddresses(
      addresses,
      sessionId,
      listIndex,
    );
    return this.dbServise.db.address.getSessionById(sessionId);
  }

  public async getAddressResultsBySessionId(sessionId: number) {
    return this.dbServise.db.address.getAddressResultsBySessionId(sessionId);
  }

  public async hydrateSessionAdresses(
    sessionId: number,
    tokenIndex = 0,
    limit = FIAS_DB_STEP,
  ) {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    isDev && Logger.log(`Getting FIAS data for session ${sessionId}`);

    try {
      let addresses = [];
      do {
        const startTime = isDev ? performance.now() : 0;
        let fiasRequests = 0;
        let dadataRequests = 0;
        addresses =
          await this.dbServise.db.address.getSessionUnfinishedAddresses(
            sessionId,
            limit,
          );

        const rateLimitMs = 1000 / FIAS_REQUESTS_PER_SECOND;
        const tokens$ = interval(rateLimitMs).pipe(startWith(0));

        const hydratedData = zip(from(addresses), tokens$).pipe(
          mergeMap(
            ([arg]) =>
              from(this.fias.getAddress(arg.address)).pipe(
                tap((value) => {
                  dadataRequests += value?.dadataRequests || 0;
                  fiasRequests += value?.fiasRequests || 0;
                }),
                map((value: FiasAddressWithDetails): AddressReslutUpdate => {
                  if (value?.object_id < 0) {
                    throw new NotFoundException(
                      `Адрес "${arg.address}" не найден`,
                    );
                  }
                  return {
                    id: arg.id,
                    ...formatFiasDataForDb(value),
                    updatedAt: new Date().toISOString(),
                  };
                }),
                catchError((error) => {
                  // isDev && Logger.warn(error);
                  return of({
                    id: arg.id,
                    ...addressNotFoundParsedToResult,
                    updatedAt: new Date().toISOString(),
                  });
                }),
              ),
            FIAS_CONCURRENCY, // Set your desired concurrency level here
          ),
          // bufferCount(50), // Process in batches of 50
          // mergeMap(batch => forkJoin(batch.map(processAddress))
          // throttle(() => interval(FIAS_TIMEOUT)),
          toArray(),
        );
        const data = await lastValueFrom(hydratedData);

        if (fiasRequests > 0) {
          this.dbServise.db.address.insertRatesUsage(
            sessionId,
            fiasRequests,
            'fias',
            tokenIndex,
          );
        }

        if (dadataRequests > 0) {
          this.dbServise.db.address.insertRatesUsage(
            sessionId,
            dadataRequests,
            'dadata',
            tokenIndex,
          );
        }

        await this.dbServise.db.address.updateAddressResult(data).then(() => {
          this.dbServise.db.address.addUnomsToResultAddress(sessionId);
        });
        const endTime = isDev ? performance.now() : 0;
        isDev &&
          Logger.log(
            `${Math.floor((endTime - startTime) / addresses.length)}ms/address | DB update ${data?.length || 0} [${fiasRequests || 0} fias + ${dadataRequests || 0} dadata]`,
          );
      } while (addresses?.length > 0);
    } catch {
      (e: any) => Logger.error(e);
    }
  }
}
