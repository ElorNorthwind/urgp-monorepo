import { createFileRoute } from '@tanstack/react-router';
import { VksDashboardPage, VksReportPage } from '@urgp/client/pages';
import { vksDashbordPageSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/vks/report')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <VksReportPage />,

  validateSearch: (search) => {
    return vksDashbordPageSearchSchema.partial().parse(search);
  },
});
