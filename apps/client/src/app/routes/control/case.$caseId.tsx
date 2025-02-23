import { createFileRoute } from '@tanstack/react-router';
import { casesApi, operationsApi } from '@urgp/client/entities';
import { ControlCasesPage, SingleCasePage } from '@urgp/client/pages';
import { store } from '@urgp/client/shared';
import { casesPageSearch } from '@urgp/shared/entities';
import { Suspense } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/control/case/$caseId')({
  loader: ({ params }) => {
    return store.dispatch(
      casesApi.endpoints.getCaseById.initiate(
        z.coerce.number().int().parse(params.caseId),
      ),
    );
  },
  component: () => <SingleCasePage />,
});
