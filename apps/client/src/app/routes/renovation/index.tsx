import { createFileRoute } from '@tanstack/react-router';
import { RenovationDashboardPage } from '@urgp/client/pages';
import { z } from 'zod';

export const Route = createFileRoute('/renovation/')({
  component: () => <RenovationDashboardPage />,
  validateSearch: (search) => {
    return z.object({ tab: z.string().optional() }).parse(search);
  },
});
