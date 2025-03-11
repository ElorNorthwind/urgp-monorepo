import { lazy } from 'react';

export const ControlSettingsNavbar = lazy(
  () => import('./ui/ControlSettingsNavbar'),
);

export const ControlFilterSettingsPage = lazy(
  () => import('./ui/ControlFilterSettingsPage'),
);

export const ControlApproveChainPage = lazy(
  () => import('./ui/ControlApproveChainPage'),
);

export const ControlAccountPage = lazy(() => import('./ui/ControlAccountPage'));

export const ControlChangePasswordPage = lazy(
  () => import('./ui/ChangePasswordPage'),
);
