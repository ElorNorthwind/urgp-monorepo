import { createLazyFileRoute } from '@tanstack/react-router';
import { MainPage } from '@urgp/client/pages';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return <MainPage />;
}
