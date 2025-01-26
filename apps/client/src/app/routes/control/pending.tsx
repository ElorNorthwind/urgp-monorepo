import { createFileRoute } from '@tanstack/react-router';
import { operationsApi } from '@urgp/client/entities';
import { PendingCasesPage } from '@urgp/client/pages';
import { store } from '@urgp/client/shared';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/pending')({
  component: () => <PendingCasesPage />,
  validateSearch: async (search) => {
    if (search?.selectedCase && typeof search?.selectedCase === 'number') {
      await store.dispatch(
        operationsApi.endpoints.markRemindersAsSeen.initiate([
          search.selectedCase as number,
        ]),
      );
    }
    return casesPageSearch.parse(search);
  },
});
