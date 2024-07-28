import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/oldbuildings')({
  component: () => <Navigate to="/renovation/oldbuildings" />,
});
