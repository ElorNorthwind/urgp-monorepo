import { lazy } from 'react';

export const EquitySettingsNavbar = lazy(
  () => import('./ui/EquitySettingsNavbar'),
);

export const EquityAccountPage = lazy(() => import('./ui/EquityAccountPage'));

export const EquityChangePasswordPage = lazy(
  () => import('./ui/ChangePasswordPage'),
);
