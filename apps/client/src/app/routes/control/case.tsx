import { createFileRoute } from '@tanstack/react-router';
import { casesApi, operationsApi } from '@urgp/client/entities';
import { ControlCasesPage, SingleCasePage } from '@urgp/client/pages';
import { store } from '@urgp/client/shared';
import { casesPageSearch } from '@urgp/shared/entities';
import { Suspense } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/control/case')({
  validateSearch: (search) => {
    return z.object({ id: z.coerce.number().int() }).parse(search);
  },
  // },
  component: () => <SingleCasePage />,
});
