import { createFileRoute } from '@tanstack/react-router';
import { EquityObjectsPage, VksCasesPage } from '@urgp/client/pages';
import { vksCasesPageSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/vks/cases')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  component: () => <VksCasesPage />,
  validateSearch: (search) => {
    return vksCasesPageSearchSchema.parse(search);
  },
});
