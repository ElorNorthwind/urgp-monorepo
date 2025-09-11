import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

type SuccessefulResult = {
  isError: false;
  rows: oracledb.Result<unknown>['rows'];
  err: null;
};
type ErrorResult = { isError: true; rows: null; err: any };
export type OracleQueryResult = SuccessefulResult | ErrorResult;

export async function runOracleQuery(
  configService: ConfigService,
  query: string,
): Promise<OracleQueryResult> {
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
    const result = await connection.execute(query);
    return { isError: false, rows: result?.rows || [], err: null };
  } catch (err) {
    Logger.error('Error connecting to Oracle:', err);
    return { isError: true, rows: null, err };
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

function setOracleClient(path?: string) {
  let clientOpts = {};
  if (process.platform === 'win32') {
    // Windows
    // If you use backslashes in the libDir string, you will
    // need to double them.
    clientOpts = {
      libDir: path || 'C:\\oracle\\instantclient_23_5',
    };
  } else if (process.platform === 'darwin' && process.arch === 'arm64') {
    // macOS ARM64
    clientOpts = {
      libDir: path || process.env['HOME'] + '/Downloads/instantclient_23_3',
    };
  }
  // else on other platforms like Linux the system library search path MUST always be
  // set before Node.js is started, for example with ldconfig or LD_LIBRARY_PATH.

  // enable node-oracledb Thick mode
  oracledb.initOracleClient(clientOpts);
}
