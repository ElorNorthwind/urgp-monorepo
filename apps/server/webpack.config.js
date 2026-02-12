const { NxWebpackPlugin } = require('@nx/webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/server'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      sourceMap: true,
    }),
    new CopyPlugin({
      patterns: [
        // {
        //   from: '../../libs/server/database/src/repos/sql/renovation',
        //   to: join(__dirname, '../../dist/apps/server/sql/renovation'),
        // },
        {
          from: '../../libs/server/database/src/repos/sql/users',
          to: join(__dirname, '../../dist/apps/server/sql/users'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/control/cases',
          to: join(__dirname, '../../dist/apps/server/sql/control/cases'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/control/operations',
          to: join(__dirname, '../../dist/apps/server/sql/control/operations'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/control/classificators',
          to: join(
            __dirname,
            '../../dist/apps/server/sql/control/classificators',
          ),
        },
        {
          from: '../../libs/server/database/src/repos/sql/address/data-mos',
          to: join(__dirname, '../../dist/apps/server/sql/address/data-mos'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/geo',
          to: join(__dirname, '../../dist/apps/server/sql/geo'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/address/sessions',
          to: join(__dirname, '../../dist/apps/server/sql/address/sessions'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/address/results',
          to: join(__dirname, '../../dist/apps/server/sql/address/results'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/address/rates',
          to: join(__dirname, '../../dist/apps/server/sql/address/rates'),
        },
        // // equity
        {
          from: '../../libs/server/database/src/repos/sql/equity/objects',
          to: join(__dirname, '../../dist/apps/server/sql/equity/objects'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/equity/claims',
          to: join(__dirname, '../../dist/apps/server/sql/equity/claims'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/equity/operations',
          to: join(__dirname, '../../dist/apps/server/sql/equity/operations'),
        },
        {
          from: '../../libs/server/database/src/repos/sql/equity/classificators',
          to: join(
            __dirname,
            '../../dist/apps/server/sql/equity/classificators',
          ),
        },
        // //old vks
        // {
        //   from: '../../libs/server/database/src/repos/sql/vks',
        //   to: join(__dirname, '../../dist/apps/server/sql/vks'),
        // },
        //letters
        {
          from: '../../libs/server/database/src/repos/sql/letters',
          to: join(__dirname, '../../dist/apps/server/sql/letters'),
        },
        // new vks
        {
          from: '../../libs/server/dgi-analytics/src/repos/sql/vks',
          to: join(__dirname, '../../dist/apps/server/sql/vks'),
        },
        // new renovation
        {
          from: '../../libs/server/dsa-dgi/src/repos/sql/renovation',
          to: join(__dirname, '../../dist/apps/server/sql/renovation'),
        },
        {
          from: '../../libs/server/dsa-dgi/src/repos/sql/renovation-sync',
          to: join(__dirname, '../../dist/apps/server/sql/renovation-sync'),
        },
      ],
    }),
  ],
  // module: {
  //   rules: [
  //     {
  //       test: /\.sql/,
  //       type: 'asset/resource',
  //     },
  //   ],
  // },
  // resolve: {
  //   extensions: ['.sql'],
  // },
};
