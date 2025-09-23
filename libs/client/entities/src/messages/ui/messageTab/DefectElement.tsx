import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  cn,
  selectCurrentUser,
  Separator,
} from '@urgp/client/shared';
import { ApartmentDefect, ExtendedStage, Stage } from '@urgp/shared/entities';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import {
  BrickWallFire,
  ExternalLink,
  Link,
  Pencil,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { DeleteMessageButton } from './DeleteMessageButton';
import { useDeleteStage } from '../../api/stagesApi';
import { ApproveStageForm } from './ApproveStageForm';
import { format } from 'date-fns';

type DefectElementProps = {
  defect: ApartmentDefect;
  className?: string;
};

const DefectElement = ({
  defect,
  className,
}: DefectElementProps): JSX.Element | null => {
  return (
    <Card
      className={cn('relative overflow-hidden transition', className)}
      key={defect.newApartId}
    >
      <CardHeader
        className={cn(
          'bg-muted-foreground/5 flex flex-row items-center justify-start gap-1 p-2 font-bold',
        )}
      >
        {/* <CardHeader className="flex flex-row items-center justify-between"> */}
        <BrickWallFire className="size-7" />
        <span className={cn('flex flex-row items-center justify-start gap-1')}>
          {defect?.adress || '-'}
        </span>
        {defect?.url && (
          <a
            className="ml-auto pr-1 hover:underline"
            href={defect?.url}
            target="_blank"
          >
            <ExternalLink className="size-7 flex-shrink-0" />
          </a>
        )}
        {/* </CardHeader> */}
      </CardHeader>
      <CardContent className={cn('w-full border-t p-0')}>
        <div className="flex w-full flex-col gap-0 p-2">
          {defect?.conplaintDate && (
            <p className={cn('nowrap flec-coltext-sm flex w-full')}>
              <span className="font-thin">Дата получения обращения:</span>
              <span className="ml-auto  text-right">
                {format(defect.conplaintDate, 'dd.MM.yyyy')}
              </span>
            </p>
          )}
          {defect?.entryDate && (
            <p className={cn('nowrap flec-coltext-sm flex w-full')}>
              <span className="font-thin">Дата заведения:</span>
              <span className="ml-auto  text-right">
                {format(defect.entryDate, 'dd.MM.yyyy')}
              </span>
            </p>
          )}
          {defect?.changedDoneDate && (
            <p className={cn('nowrap flec-coltext-sm flex w-full')}>
              <span className="font-thin">
                Дата завершения работ (после переносов):
              </span>
              <span className="ml-auto  text-right">
                {format(defect.changedDoneDate, 'dd.MM.yyyy')}
              </span>
            </p>
          )}
          {defect?.actualDoneDate && (
            <p className={cn('nowrap flec-coltext-sm flex w-full')}>
              <span className="font-thin">
                Дата завершения работ (фактическая):
              </span>
              <span className="ml-auto  text-right">
                {format(defect.actualDoneDate, 'dd.MM.yyyy')}
              </span>
            </p>
          )}
        </div>
      </CardContent>

      {defect.description && (
        <CardFooter className="border-t p-2">
          {defect.description
            .replace(/(?:\r\n|\r|\n)/g, '\\n')
            .split('\\n')
            .map((item, index) => {
              return (
                <span key={index}>
                  {item}
                  <br />
                </span>
              );
            })}
        </CardFooter>
      )}
    </Card>
  );
};

export { DefectElement };
