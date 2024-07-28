import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/renovation/')({
  component: () => <div>Тут будет дашборд</div>,
});
