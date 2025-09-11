import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { setOracleClient } from './setOracleClient';

export async function runOracleCallback(
  configService: ConfigService,
  onSuccess: (connection: oracledb.Connection) => any,
  onError?: (err: any) => any,
) {
  let connection;
  try {
    setOracleClient(configService.get('ORACLE_INSTANT_CLIENT_DIR'));

    connection = await oracledb.getConnection({
      user: configService.get('DM_USERNAME') || 'user',
      password: configService.get('DM_PASSWORD') || 'password',
      connectString:
        `${configService.get('DM_HOST')}:${configService.get('DM_PORT')}/${configService.get('DM_SERVICE_NAME')}` ||
        'localhost:1521/xe',
    });
    Logger.log('Successfully connected to Oracle');
    return onSuccess(connection);
  } catch (err) {
    Logger.error('Error connecting to Oracle:', err);
    return onError && onError(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        Logger.log('Connection to Oracle closed.');
      } catch (err) {
        Logger.error('Error closing connection to Oracle:', err);
      }
    }
  }
}
