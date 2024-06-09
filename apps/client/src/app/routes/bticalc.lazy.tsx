import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { BtiCalcPage } from '@urgp/client/pages';
import { MainLayout } from '@urgp/shared/ui';
import { Calculator } from 'lucide-react';

export const Route = createLazyFileRoute('/bticalc')({
  component: BtiCalc,
});

function BtiCalc() {
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
      content={<BtiCalcPage />}
    />
  );
}
