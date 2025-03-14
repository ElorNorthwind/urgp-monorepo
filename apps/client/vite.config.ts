/// <reference types='vitest' />
import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
// import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import svgr from 'vite-plugin-svgr';
import { join } from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client',

  server: {
    port: 4200,
    host: 'localhost',
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000/api',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    nxViteTsPaths(),
    TanStackRouterVite({
      routesDirectory: join(__dirname, 'src/app/routes'),
      generatedRouteTree: join(__dirname, 'src/app/routeTree.gen.ts'),
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single',
      autoCodeSplitting: true,
    }),
    react(),
    svgr({ include: '**/*.svg?react' }),
    // visualizer({
    //   template: 'treemap', // or sunburst
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   filename: 'analyse.html', // will be saved in project's root
    // }) as PluginOption,
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/client',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/client',
      provider: 'v8',
    },
  },
});
