import { createFileRoute } from '@tanstack/react-router';
import { VksDashboardPage } from '@urgp/client/pages';
import { vksDashbordPageSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/vks/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <VksDashboardPage />,

  validateSearch: (search) => {
    return vksDashbordPageSearchSchema.partial().parse(search);
  },
});
