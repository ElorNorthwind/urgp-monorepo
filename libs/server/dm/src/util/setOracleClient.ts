import * as oracledb from 'oracledb';

export function setOracleClient(path?: string) {
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
