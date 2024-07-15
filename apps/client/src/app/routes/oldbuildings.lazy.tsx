import { createLazyFileRoute } from '@tanstack/react-router';
import { OldBuildingsPage } from '@urgp/client/pages';

export const Route = createLazyFileRoute('/oldbuildings')({
  component: OldBuildings,
});

function OldBuildings() {
  return <OldBuildingsPage />;
}
