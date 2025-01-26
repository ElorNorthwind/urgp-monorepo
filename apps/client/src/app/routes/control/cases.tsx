import { createFileRoute } from '@tanstack/react-router';
import { operationsApi } from '@urgp/client/entities';
import { ControlCasesPage } from '@urgp/client/pages';
import { store } from '@urgp/client/shared';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/cases')({
  component: () => <ControlCasesPage />,
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
  beforeLoad: async ({ search }) => {},
});
