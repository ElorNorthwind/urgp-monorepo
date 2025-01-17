import {
  cn,
  selectStageFormState,
  selectStageFormValues,
  Skeleton,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { StageHistoryItem } from '../StagesList/StageHistoryItem';
import { useStages } from '../../api/operationsApi';

type EditedStageDisplayElementProps = {
  className?: string;
};

const EditedStageDisplayElement = ({
  className,
}: EditedStageDisplayElementProps): JSX.Element | null => {
  const isEdit = useSelector(selectStageFormState) === 'edit';
  const stageId = useSelector(selectStageFormValues)?.id || 0;

  const { data: stages, isLoading: isStagesLoading } = useStages(stageId, {
    skip: !isEdit || !stageId || stageId === 0,
  });
  const editStage = stages?.find((stage: ControlStage) => stage.id === stageId);

  if (!isEdit || !stageId) return null;

  return isStagesLoading ? (
    <Skeleton className={className} />
  ) : editStage ? (
    <StageHistoryItem
      item={{
        ...editStage.payload,
        class: editStage.class,
        id: editStage.id,
        caseId: editStage.caseId || 0,
      }}
      className={cn('bg-amber-50', className)}
    />
  ) : null;
};

export { EditedStageDisplayElement as EditedStageDusplayElement };
