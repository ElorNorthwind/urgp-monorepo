import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@urgp/shared/ui';
import { cn } from '@urgp/shared/util';
import { memo } from 'react';

interface AdressSearchFormProps {
  className?: string;
}

export const AdressSearchForm: React.FC = memo(
  ({ className }: AdressSearchFormProps) => {
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
