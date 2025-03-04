import { createFileRoute } from '@tanstack/react-router';
import { AddressMySessionsPage } from '@urgp/client/pages';

export const Route = createFileRoute('/address/sessions')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <AddressMySessionsPage />,
  // validateSearch: (search) => {
  //   return addressUploadPageSearchSchema.parse(search);
  // },
});
