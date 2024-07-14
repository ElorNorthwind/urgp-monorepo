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
          from: '../../libs/shared/entities/src/repos/sql/',
          to: join(__dirname, '../../dist/apps/server/sql'),
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
