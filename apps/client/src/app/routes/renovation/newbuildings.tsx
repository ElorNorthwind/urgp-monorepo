import { createFileRoute } from '@tanstack/react-router';
import { NewBuildingsPage } from '@urgp/client/pages';
import { newBuildingsSearchSchema } from '@urgp/shared/entities';

export const Route = createFileRoute('/renovation/newbuildings')({
  component: NewBuildingsPage,
  validateSearch: (search) => {
    return newBuildingsSearchSchema.parse(search);
  },
});
