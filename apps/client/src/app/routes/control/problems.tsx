import { createFileRoute } from '@tanstack/react-router';
import { operationsApi } from '@urgp/client/entities';
import { ControlProblemsPage } from '@urgp/client/pages';
import { store } from '@urgp/client/shared';
import { problemsPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/problems')({
  component: () => <ControlProblemsPage />,
  validateSearch: async (search) => {
    if (search?.selectedCase && typeof search?.selectedCase === 'number') {
      await store.dispatch(
        operationsApi.endpoints.markReminders.initiate({
          mode: 'seen',
          case: [search.selectedCase as number],
        }),
      );
    }
    return problemsPageSearch.parse(search);
  },
});
