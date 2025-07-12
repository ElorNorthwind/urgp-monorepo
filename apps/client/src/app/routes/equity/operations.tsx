import { createFileRoute } from '@tanstack/react-router';
import { EquityOperationLogPage } from '@urgp/client/pages';
import { equityOperationLogPageSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/equity/operations')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <EquityOperationLogPage />,
  validateSearch: (search) => {
    return equityOperationLogPageSearchSchema.parse(search);
  },
});
