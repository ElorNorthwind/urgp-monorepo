import { cn } from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';

type ClaimIdentificationProps = {
  claim?: EquityClaim;
  className?: string;
};

const ClaimIdentification = (
  props: ClaimIdentificationProps,
): JSX.Element | null => {
  const { claim, className } = props;

  return (
    <div className={cn('truncate', className)}>
      {claim?.identificationNotes}
    </div>
  );
};

export { ClaimIdentification };
