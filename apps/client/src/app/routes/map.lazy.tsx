import { createLazyFileRoute } from '@tanstack/react-router';
import { MapPage } from '@urgp/client/pages';

export const Route = createLazyFileRoute('/map')({
  component: Map,
});

function Map() {
  return <MapPage />;
}
