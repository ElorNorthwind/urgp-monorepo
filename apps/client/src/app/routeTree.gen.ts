/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const OldbuildingsLazyImport = createFileRoute('/oldbuildings')()
const MapLazyImport = createFileRoute('/map')()
const BticalcLazyImport = createFileRoute('/bticalc')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const OldbuildingsLazyRoute = OldbuildingsLazyImport.update({
  path: '/oldbuildings',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/oldbuildings.lazy').then((d) => d.Route))

const MapLazyRoute = MapLazyImport.update({
  path: '/map',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/map.lazy').then((d) => d.Route))

const BticalcLazyRoute = BticalcLazyImport.update({
  path: '/bticalc',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/bticalc.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/bticalc': {
      preLoaderRoute: typeof BticalcLazyImport
      parentRoute: typeof rootRoute
    }
    '/map': {
      preLoaderRoute: typeof MapLazyImport
      parentRoute: typeof rootRoute
    }
    '/oldbuildings': {
      preLoaderRoute: typeof OldbuildingsLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AboutLazyRoute,
  BticalcLazyRoute,
  MapLazyRoute,
  OldbuildingsLazyRoute,
])

/* prettier-ignore-end */
