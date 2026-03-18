/* eslint-disable max-lines */
'use client';

import {
  useUpdateIsSentToYandex,
  useUpdateIsTechnical,
  useVksCaseDetails,
} from '@urgp/client/entities';
import {
  cn,
  ToggleGroup,
  ToggleGroupItem,
  toggleVariants,
  useVksAbility,
} from '@urgp/client/shared';
import { VariantProps } from 'class-variance-authority';
import { Link, Meh, Star, StarOff, Unlink } from 'lucide-react';
import { type FC } from 'react';

type VksSentToYandexToggleProps = {
  caseId: number;
  className?: string;
} & VariantProps<typeof toggleVariants>;

/** The DateRangePicker component allows a user to select a range of dates */
export const VksSentToYandexToggle: FC<VksSentToYandexToggleProps> = ({
  caseId,
  className,
  size = 'default',
  variant = 'outline',
}): JSX.Element | null => {
  const i = useVksAbility();
  const [updateIsSentToYandex, { isLoading: isUpdateLoading }] =
    useUpdateIsSentToYandex();
  const { data, isLoading, isFetching } = useVksCaseDetails(caseId, {
    skip: !caseId || caseId === 0,
  });

  if (i.cannot('update', 'VksCase') || data?.status !== 'обслужен') return null;

  return (
    <ToggleGroup
      disabled={isUpdateLoading || isLoading || isFetching}
      variant={variant}
      size={size}
      type="single"
      className={cn('', className)}
      value={data?.operatorSurveySentToYandex === true ? 'sent' : 'notSent'}
      onValueChange={(value) => {
        updateIsSentToYandex({
          caseId,
          value: value === 'sent' ? true : false,
        });
      }}
    >
      <ToggleGroupItem value="sent" aria-label="Toggle sent" className="group">
        <Link className="h-4 w-4 opacity-35 group-data-[state=on]:text-orange-500 group-data-[state=on]:opacity-100" />
        <p className="opacity-50 group-data-[state=on]:opacity-100">
          Направлен на Яндекс
        </p>
      </ToggleGroupItem>
      {/* <ToggleGroupItem value="undesided" aria-label="Toggle undesided">
        <Meh className="h-4 w-4" />
        <p>Без решения</p>
      </ToggleGroupItem> */}
      <ToggleGroupItem
        value="notSent"
        aria-label="Toggle notSent"
        className="group"
      >
        <Unlink
          className={
            'h-4 w-4  opacity-35 group-data-[state=on]:text-rose-500 group-data-[state=on]:opacity-100'
          }
        />
        <p className="opacity-50 group-data-[state=on]:opacity-100">
          Не направлен на Яндекс
        </p>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

VksSentToYandexToggle.displayName = 'VksSentToYandexToggle';
