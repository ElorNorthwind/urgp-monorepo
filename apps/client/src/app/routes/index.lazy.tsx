import { createLazyFileRoute, Navigate } from '@tanstack/react-router';
// import { MainPage } from '@urgp/client/pages';

export const Route = createLazyFileRoute('/')({
  component: () => <Navigate to="/renovation" />,
});

// function Index() {
//   return <MainPage />;
// }
