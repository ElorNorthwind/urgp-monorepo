import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@urgp/shared/ui';
import { cn } from '@urgp/shared/util';
import { memo } from 'react';

interface AdressSearchCardProps {
  className?: string;
}

export const AdressSearchCard: React.FC = memo(
  ({ className }: AdressSearchCardProps) => {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>Поиск адреса через РСМ 2.0</CardTitle>
          <CardDescription>
            Найти нужное здание в базе данных БТИ
          </CardDescription>
        </CardHeader>
        <CardContent>Тут будет форма</CardContent>
      </Card>
    );
  },
);
