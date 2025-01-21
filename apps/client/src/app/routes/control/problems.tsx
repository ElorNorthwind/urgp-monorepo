import { createFileRoute } from '@tanstack/react-router';
import { ControlAccountPage, ControlCasesPage } from '@urgp/client/pages';
import { casesPageSearch } from '@urgp/shared/entities';

export const Route = createFileRoute('/control/problems')({
  component: () => <div>Проблемы (TBD)</div>,
});
