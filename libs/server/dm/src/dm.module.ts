import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { DgiAnalyticsModule } from '@urgp/server/dgi-analytics';

@Module({
  imports: [DgiAnalyticsModule],
  controllers: [DmController],
  providers: [
    DmService,
    {
      provide: 'ORACLE_DB_POOL',
      useFactory: async (configService: ConfigService) => {
        let clientOpts = {};
        if (process.platform === 'win32') {
          // Windows
          // If you use backslashes in the libDir string, you will
          // need to double them.
          clientOpts = {
            libDir:
              configService.get('ORACLE_INSTANT_CLIENT_DIR') ||
              'C:\\oracle\\instantclient_23_9',
          };
        } else if (process.platform === 'darwin' && process.arch === 'arm64') {
          // macOS ARM64
          clientOpts = {
            libDir:
              configService.get('ORACLE_INSTANT_CLIENT_DIR') ||
              process.env['HOME'] + '/Downloads/instantclient_23_3',
          };
        }
        // else on other platforms like Linux the system library search path MUST always be
        // set before Node.js is started, for example with ldconfig or LD_LIBRARY_PATH.

        // enable node-oracledb Thick mode
        oracledb.initOracleClient(clientOpts);

        const dbConfig = {
          user: configService.get('DM_USERNAME') || 'user',
          password: configService.get('DM_PASSWORD') || 'password',
          connectString:
            `${configService.get('DM_HOST')}:${configService.get('DM_PORT')}/${configService.get('DM_SERVICE_NAME')}` ||
            'localhost:1521/xe',
          poolMax: 5,
          poolMin: 2,
          poolIncrement: 1,
        };
        await oracledb.createPool(dbConfig);
        Logger.log('Oracle connection pool created.');
        return oracledb.getPool();
      },
      inject: [ConfigService],
    },
  ],
})
export class DmModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await oracledb.getPool().close(10);
    Logger.log('Oracle connection pool closed.');
  }
}
