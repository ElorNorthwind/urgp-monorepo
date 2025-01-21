import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button, cn } from '@urgp/client/shared';

const navbarItems = [
  { name: 'Учетная запись', path: '/control/settings' },
  { name: 'Сменить пароль', path: '/control/settings/change-password' },
];

const ControlSettingsNavbar = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  const router = useRouterState();
  const navigate = useNavigate();

  return (
    <nav
      className={cn(
        'bg-primary-foreground flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
    >
      {navbarItems.map((item) => (
        <Button
          key={item.path}
          variant={'ghost'}
          onClick={() => navigate({ to: item.path })}
          disabled={router.location.pathname === item.path}
          className={cn(
            'w-full lg:justify-start',
            router.location.pathname === item.path &&
              'bg-muted-foreground/20 text-primary',
          )}
        >
          {item.name}
        </Button>
      ))}
    </nav>
  );
};
export { ControlSettingsNavbar };
