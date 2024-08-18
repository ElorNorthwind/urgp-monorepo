import { createFileRoute } from '@tanstack/react-router';
import { MessagesPage } from '@urgp/client/pages';
import { messagesPageSearch } from '@urgp/shared/entities';
import { z } from 'zod';

export const Route = createFileRoute('/renovation/messages')({
  component: () => <MessagesPage />,
  validateSearch: (search) => {
    return messagesPageSearch.parse(search);
  },
});
