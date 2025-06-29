import { createFileRoute } from '@tanstack/react-router';
import { EquityDashboardPage } from '@urgp/client/pages';

export const Route = createFileRoute('/equity/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <EquityDashboardPage />,
  // validateSearch: (search) => {
  //   return addressUploadPageSearchSchema.parse(search);
  // },
});
