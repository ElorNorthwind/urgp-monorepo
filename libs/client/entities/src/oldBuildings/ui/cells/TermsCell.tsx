import { CellContext } from '@tanstack/react-table';
import { VStack } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';

function TermsCell(
  props: CellContext<OldBuilding, string | null>,
): JSX.Element {
  const planTerms = props.row.original.terms.plan;
  const actualTerms = props.row.original.terms.actual;

  return (
    <VStack gap="none" align={'start'}>
      <div className="text-muted-foreground min-w-[50px] text-xs opacity-70">
        {planTerms.firstResetlementStart
          ? new Date(planTerms.firstResetlementStart).toLocaleDateString(
              'ru-RU',
            )
          : ' '}
      </div>
      <div className="min-w-[50px] text-xs">
        {actualTerms.firstResetlementStart
          ? new Date(actualTerms.firstResetlementStart).toLocaleDateString(
              'ru-RU',
            )
          : ' '}
      </div>
    </VStack>
  );
}

export { TermsCell };
