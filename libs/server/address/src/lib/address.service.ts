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
  splitAddress,
} from '@urgp/shared/entities';
import { FiasService } from 'libs/server/fias/src/lib/fias.service';
import {
  catchError,
  from,
  lastValueFrom,
  map,
  mergeMap,
  of,
  toArray,
} from 'rxjs';
import { formatFiasDataForDb } from './helper/formatFiasDataForDb';

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

  public async getAddressResultsBySessionId(sessionId: number) {
    return this.dbServise.db.address.getAddressResultsBySessionId(sessionId);
  }

  public async hydrateSessionAdresses(sessionId: number, limit = FIAS_DB_STEP) {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    isDev && Logger.log(`Getting FIAS data for session ${sessionId}`);

    const addresses =
      await this.dbServise.db.address.getSessionUnfinishedAddresses(
        sessionId,
        limit,
      );
    addresses.forEach((add) => {
      Logger.log(splitAddress(add.address));
    });
    return;

    try {
      let addresses = [];
      do {
        const startTime = isDev ? performance.now() : 0;
        addresses =
          await this.dbServise.db.address.getSessionUnfinishedAddresses(
            sessionId,
            limit,
          );

        const hydratedData = from(addresses).pipe(
          mergeMap(
            (arg) =>
              from(this.fias.getAddressByString(arg.address)).pipe(
                map((value: FiasAddressWithDetails): AddressReslutUpdate => {
                  Logger.log(splitAddress(arg.address));
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
                  isDev && Logger.warn(error);
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
        isDev && Logger.warn('DB update ' + data?.length || 0);
        await this.dbServise.db.address.updateAddressResult(data).then(() => {
          this.dbServise.db.address.addUnomsToResultAddress(sessionId);
        });
        const endTime = isDev ? performance.now() : 0;
        isDev &&
          Logger.log(
            `${Math.floor((endTime - startTime) / addresses.length)}ms/address [${Math.floor(endTime - startTime)} total]`,
          );
      } while (addresses?.length > 0);
    } catch {
      (e: any) => Logger.error(e);
    }
  }
}
