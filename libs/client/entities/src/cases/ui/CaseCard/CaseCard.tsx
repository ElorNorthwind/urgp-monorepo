import { Accordion } from '@urgp/client/shared';
import {
  CaseInfoTab,
  CaseNotesTab,
  ConnectedCasesTab,
  DispatchesTab,
  ExternalCasesTab,
} from '@urgp/client/widgets';
import { CaseFull, OperationClasses } from '@urgp/shared/entities';
import { StagesHeader, StagesList, useOperations } from '../../../operations';
import { CaseCardFooter } from './CaseCardFooter';
import { CaseCardHeader } from './CaseCardHeader';

type CaseCardProps = {
  controlCase: CaseFull;
  onPrevCase?: () => void;
  onNextCase?: () => void;
  onClose?: () => void;
};

const CaseCard = (props: CaseCardProps): JSX.Element => {
  const { controlCase, onNextCase, onPrevCase } = props;

  const {
    data: stages,
    isLoading,
    isFetching,
  } = useOperations(
    { class: OperationClasses.stage, case: controlCase?.id },
    { skip: !controlCase?.id || controlCase?.id === 0 },
  );

  return (
    <>
      <CaseCardHeader
        controlCase={controlCase}
        onClose={props.onClose}
        onPrevCase={onPrevCase}
        onNextCase={onNextCase}
      />
      <Accordion
        type="multiple"
        className="w-full px-4"
        defaultValue={['description']}
      >
        <CaseInfoTab controlCase={controlCase} label={null} />
        <CaseNotesTab
          controlCase={controlCase}
          accordionItemName="description"
        />
        <ExternalCasesTab
          controlCase={controlCase}
          accordionItemName="external"
        />

        <ConnectedCasesTab
          controlCase={controlCase}
          accordionItemName="connections"
        />
        <DispatchesTab
          controlCase={controlCase}
          accordionItemName="dispatches"
        />
      </Accordion>
      <StagesHeader caseId={controlCase?.id} className="mx-4 mt-4 pr-6" />
      <StagesList
        stages={stages}
        isLoading={isLoading || isFetching}
        className="m-4"
        controlLevel={controlCase?.controlLevel || 0}
      />
      <CaseCardFooter controlCase={controlCase} />
    </>
  );
};

export { CaseCard };
