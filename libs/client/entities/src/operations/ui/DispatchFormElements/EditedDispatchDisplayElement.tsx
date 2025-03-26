import {
  selectDispatchFormState,
  selectDispatchFormValues,
  Skeleton,
} from '@urgp/client/shared';
import { useSelector } from 'react-redux';
import { useCaseById } from '../../../cases';
import { CaseCardHeader } from '../../../cases/ui/CaseCard/CaseCardHeader';

type EditedDispatchDisplayElementProps = {
  className?: string;
};

const EditedDispatchDisplayElement = ({
  className,
}: EditedDispatchDisplayElementProps): JSX.Element | null => {
  const isEdit = useSelector(selectDispatchFormState) === 'edit';
  const caseId = useSelector(selectDispatchFormValues)?.caseId || 0;

  const { data: controlCase, isLoading: isCaseLoading } = useCaseById(caseId, {
    skip: !isEdit || !caseId || caseId === 0,
  });

  if (!isEdit || !caseId) return null;

  return isCaseLoading ? (
    <Skeleton className={className} />
  ) : controlCase ? (
    <div className="overflow-auto">
      <CaseCardHeader controlCase={controlCase} className="rounded-t" />
      <div className="bg-sidebar/80 max-h-40 overflow-y-auto rounded-b border-t p-4">
        {controlCase?.notes}
      </div>
    </div>
  ) : null;
};

export { EditedDispatchDisplayElement };
