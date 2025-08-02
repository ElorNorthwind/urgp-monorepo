import { createFileRoute } from '@tanstack/react-router';
import { EquityDashboardPage, VksDashboardPage } from '@urgp/client/pages';

export const Route = createFileRoute('/vks/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <VksDashboardPage />,
  // validateSearch: (search) => {
  //   return addressUploadPageSearchSchema.parse(search);
  // },
});
