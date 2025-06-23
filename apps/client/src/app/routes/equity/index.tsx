import { createFileRoute } from '@tanstack/react-router';
import { AddressUploadPage } from '@urgp/client/pages';
import { addressUploadPageSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/equity/')({
  // beforeLoad: () => {
  //   throw redirect({ to: '/control/cases' });
  // },
  // component: () => <ExcelFileInput />,
  component: () => <div>Тут будут дольщики</div>,
  // validateSearch: (search) => {
  //   return addressUploadPageSearchSchema.parse(search);
  // },
});
