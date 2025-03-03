import { createFileRoute } from '@tanstack/react-router';
import { ControlDashboardPage } from '@urgp/client/pages';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/address/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  component: () => <div className="h-full w-full ">парсилка адресов</div>,
  // validateSearch: (search) => {
  //   return casesPageSearch.parse(search);
  // },
});
