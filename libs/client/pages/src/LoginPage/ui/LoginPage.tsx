import { Toaster } from '@urgp/client/shared';
import { LoginForm } from '@urgp/client/widgets';
import { lazy, Suspense } from 'react';

const LoginAnimation = lazy(() => import('./LoginAnimation.lazy'));

const LoginPage = (): JSX.Element => {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="z-10 flex min-h-screen items-center justify-center py-12 shadow-2xl">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Добро пожаловать</h1>
            <p className="text-muted-foreground text-balance pb-4">
              Введине данные для входа
            </p>
            <LoginForm />
            {/* <Toaster closeButton richColors /> */}
          </div>
        </div>
      </div>
      <div className="hidden overflow-hidden bg-gradient-to-br from-slate-200 via-gray-50 to-stone-200 lg:block">
        <Suspense fallback={<></>}>
          <LoginAnimation />
        </Suspense>
      </div>
    </div>
  );
};

export { LoginPage };
