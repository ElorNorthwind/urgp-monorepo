import { createFileRoute } from '@tanstack/react-router';
import { MessagesPage } from '@urgp/client/pages';
import { z } from 'zod';

export const Route = createFileRoute('/renovation/messages')({
  component: () => <MessagesPage />,
  validateSearch: (search) => {
    return z
      .object({ tab: z.literal('my').or(z.literal('boss')).optional() })
      .parse(search);
  },
});
