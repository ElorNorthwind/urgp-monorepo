import { createFileRoute } from '@tanstack/react-router';
import { ExcelFileInput } from '@urgp/client/features';
import { AddressUploadPage, ControlDashboardPage } from '@urgp/client/pages';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/address/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <AddressUploadPage />,
  // validateSearch: (search) => {
  //   return casesPageSearch.parse(search);
  // },
});
