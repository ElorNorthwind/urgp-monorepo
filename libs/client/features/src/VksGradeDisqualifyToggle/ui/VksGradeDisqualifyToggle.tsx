/* eslint-disable max-lines */
'use client';

import { useUpdateIsTechnical, useVksCaseDetails } from '@urgp/client/entities';
import {
  cn,
  ToggleGroup,
  ToggleGroupItem,
  toggleVariants,
  useVksAbility,
} from '@urgp/client/shared';
import { VariantProps } from 'class-variance-authority';
import { Meh, Star, StarOff } from 'lucide-react';
import { type FC } from 'react';

type VksGradeDisqualifyToggleProps = {
  caseId: number;
  className?: string;
} & VariantProps<typeof toggleVariants>;

/** The DateRangePicker component allows a user to select a range of dates */
export const VksGradeDisqualifyToggle: FC<VksGradeDisqualifyToggleProps> = ({
  caseId,
  className,
  size = 'default',
  variant = 'outline',
}): JSX.Element | null => {
  const i = useVksAbility();
  const [updateIsTechnical, { isLoading: isUpdateLoading }] =
    useUpdateIsTechnical();
  const { data, isLoading, isFetching } = useVksCaseDetails(caseId, {
    skip: !caseId || caseId === 0,
  });

  if (i.cannot('update', 'VksCaseRequest') || !data?.grade) return null;

  return (
    <ToggleGroup
      disabled={isUpdateLoading || isLoading || isFetching}
      variant={variant}
      size={size}
      type="single"
      className={cn('', className)}
      value={data?.isTechnical === true ? 'disqualify' : 'approve'}
      onValueChange={(value) => {
        updateIsTechnical({
          caseId,
          value: value === 'disqualify' ? true : false,
        });
      }}
    >
      <ToggleGroupItem
        value="disqualify"
        aria-label="Toggle disqualify"
        className="group"
      >
        <StarOff className="h-4 w-4 opacity-35 group-data-[state=on]:opacity-100" />
        <p>Оценка не учитывается</p>
      </ToggleGroupItem>
      {/* <ToggleGroupItem value="undesided" aria-label="Toggle undesided">
        <Meh className="h-4 w-4" />
        <p>Без решения</p>
      </ToggleGroupItem> */}
      <ToggleGroupItem
        value="approve"
        aria-label="Toggle approve"
        className="group"
      >
        <Star
          className={'h-4 w-4  opacity-35 group-data-[state=on]:opacity-100'}
        />
        <p>Оценка учитывается</p>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

VksGradeDisqualifyToggle.displayName = 'VksGradeDisqualifyToggle';
