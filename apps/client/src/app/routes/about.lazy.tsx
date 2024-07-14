import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { MainLayout } from '@urgp/client/shared';
import { Calculator } from 'lucide-react';

export const Route = createLazyFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <MainLayout
      header={
        <div className="flex h-full items-center gap-4 px-6">
          <Calculator className="stroke-accent-foreground" />
          <Link to="/bticalc" className="[&.active]:font-bold">
            Главная
          </Link>{' '}
          <Link to="/about" className="[&.active]:font-bold">
            Справка
          </Link>
        </div>
      }
      content={<div>Страница описания</div>}
    />
  );
}
