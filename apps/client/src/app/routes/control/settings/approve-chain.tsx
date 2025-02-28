import { createFileRoute } from '@tanstack/react-router';
import { ControlApproveChainPage } from '@urgp/client/pages';

export const Route = createFileRoute('/control/settings/approve-chain')({
  component: () => <ControlApproveChainPage />,
});
