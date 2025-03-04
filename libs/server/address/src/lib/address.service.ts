import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import {
  addressNotFoundParsedToResult,
  AddressReslutUpdate,
  AddressSessionFull,
  FIAS_CONCURRENCY,
  FIAS_DB_STEP,
  FIAS_TIMEOUT,
  FiasAddress,
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

  public async hydrateSessionAdresses(
    sessionId: number,
    limit = FIAS_DB_STEP,
    strategy: 'hint' | 'direct' = 'direct',
  ) {
    const addressReq =
      strategy === 'direct' ? this.fias.getDirectAddress : this.fias.getAddress;
    Logger.log(`Getting FIAS data for session ${sessionId}`);
    try {
      let addresses = [];
      do {
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
                  from(this.fias.getDirectAddress(arg.address)).pipe(
                    map((value: FiasAddress): AddressReslutUpdate => {
                      if (value?.object_id < 0)
                        throw new NotFoundException('Адрес не найден');
                      // Logger.warn(value);
                      return {
                        id: arg.id,
                        ...formatFiasDataForDb(value),
                        updatedAt: new Date().toISOString(),
                      };
                    }),
                    catchError((error) =>
                      of({
                        id: arg.id,
                        ...addressNotFoundParsedToResult,
                        updatedAt: new Date().toISOString(),
                      }),
                    ),
                  ),
                FIAS_CONCURRENCY,
              ),
            ),
          ),
          toArray(),
        );
        this.dbServise.db.address
          .updateAddressResult(await lastValueFrom(hydratedData))
          .then(() => {
            this.dbServise.db.address.addUnomsToResultAddress(sessionId);
          });
      } while (addresses?.length > 0);
    } catch {
      (e: any) => Logger.error(e);
    }
  }
}
