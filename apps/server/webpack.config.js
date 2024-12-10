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
        {
          from: '../../libs/server/database/src/repos/sql/renovation',
          to: join(__dirname, '../../dist/apps/server/sql/renovation'),
        },
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
