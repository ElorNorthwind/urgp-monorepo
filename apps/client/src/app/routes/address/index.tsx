import { createFileRoute } from '@tanstack/react-router';
import { AddressUploadPage } from '@urgp/client/pages';
import { addressUploadPageSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/address/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <AddressUploadPage />,
  validateSearch: (search) => {
    return addressUploadPageSearchSchema.parse(search);
  },
});
