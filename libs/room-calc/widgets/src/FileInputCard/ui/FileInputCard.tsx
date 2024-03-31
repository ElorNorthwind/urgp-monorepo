import { Label } from '@radix-ui/react-label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@urgp/shared/ui';
import { memo } from 'react';

import classes from './FileInputCard.module.css';
import { cn } from '@urgp/shared/util';

export const FileInputCard: React.FC = memo(() => {
  return (
    <Card className={cn('w-full', classes['wavy'])}>
      <CardHeader>
        <CardTitle>Расчет по файлу Excel</CardTitle>
        <CardDescription>
          Файл экспликации, расчета или список комнат здания
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <Label htmlFor="uploadFile">Файл для расчета</Label> */}
        <Input id="uploadFile" type="file" />
      </CardContent>
    </Card>
  );
});
