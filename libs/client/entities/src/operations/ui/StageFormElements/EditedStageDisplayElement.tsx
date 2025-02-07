import {
  cn,
  selectStageFormState,
  selectStageFormValues,
  Skeleton,
} from '@urgp/client/shared';
import { useSelector } from 'react-redux';
import { useOperationById } from '../../api/operationsApi';
import { StageHistoryItem } from '../StagesList/StageHistoryItem';

type EditedStageDisplayElementProps = {
  className?: string;
};

const EditedStageDisplayElement = ({
  className,
}: EditedStageDisplayElementProps): JSX.Element | null => {
  const isEdit = useSelector(selectStageFormState) === 'edit';
  const stageId = useSelector(selectStageFormValues)?.id || 0;

  const { data: editStage, isLoading: isStagesLoading } = useOperationById(
    stageId,
    {
      skip: !isEdit || !stageId || stageId === 0,
    },
  );

  if (!isEdit || !stageId) return null;

  return isStagesLoading ? (
    <Skeleton className={className} />
  ) : editStage ? (
    <StageHistoryItem
      item={editStage}
      className={cn('bg-amber-50', className)}
    />
  ) : null;
};

export { EditedStageDisplayElement };
