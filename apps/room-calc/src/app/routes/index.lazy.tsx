import { createLazyFileRoute } from '@tanstack/react-router';
import { MainPage } from '../../pages/MainPage';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return <MainPage />;
}
