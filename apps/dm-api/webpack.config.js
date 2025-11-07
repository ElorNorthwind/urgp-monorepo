// const { NxWebpackPlugin } = require('@nx/webpack');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/dm-api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      sourceMap: true,
    }),
    // new CopyPlugin({
    //   patterns: [
    //     //old vks
    //     {
    //       from: '../../libs/dm-api/database/src/repos/sql/vks',
    //       to: join(__dirname, '../../dist/apps/dm-api/sql/vks'),
    //     },
    //     // new vks
    //     {
    //       from: '../../libs/dm-api/dgi-analytics/src/repos/sql/vks',
    //       to: join(
    //         __dirname,
    //         '../../dist/apps/dm-api/dgi-analytics/sql/vks',
    //       ),
    //     },
    //   ],
    // }),
  ],
};
