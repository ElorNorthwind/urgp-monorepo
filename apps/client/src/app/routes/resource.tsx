import { createFileRoute, Navigate } from '@tanstack/react-router';
import { ResourceDemoSankey } from '@urgp/client/widgets';

export const Route = createFileRoute('/resource')({
  component: () => <ResourceDemoSankey className="h-screen w-screen" />,
});
