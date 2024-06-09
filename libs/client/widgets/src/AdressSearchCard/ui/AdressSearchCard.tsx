import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@urgp/shared/ui';
import { cn } from '@urgp/shared/util';
import { memo } from 'react';
import { AdressSearchForm } from './AdressSearchForm';

interface AdressSearchCardProps {
  className?: string;
}

export const AdressSearchCard: React.FC = memo(
  ({ className }: AdressSearchCardProps) => {
    return (
      <Card className={cn('relative w-full', className)}>
        <CardHeader className="bg-accent/40">
          <CardTitle>Поиск адреса через РСМ 2.0</CardTitle>
          <CardDescription>
            Найти нужное здание в базе данных БТИ
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AdressSearchForm />
        </CardContent>
        {/* <CardFooter className="bg-fuchsia-100">
          {JSON.stringify(data)}
        </CardFooter> */}
      </Card>
    );
  },
);
