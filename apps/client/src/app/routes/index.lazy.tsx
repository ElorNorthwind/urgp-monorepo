import { createLazyFileRoute } from '@tanstack/react-router';
import { MainPage } from '@urgp/room-calc/pages';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return <MainPage />;
}
