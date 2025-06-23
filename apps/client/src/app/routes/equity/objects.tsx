import { createFileRoute } from '@tanstack/react-router';
import { EquityObjectsPage } from '@urgp/client/pages';
import { equityObjectsPageSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/equity/objects')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <EquityObjectsPage />,
  validateSearch: (search) => {
    return equityObjectsPageSearchSchema.parse(search);
  },
});
