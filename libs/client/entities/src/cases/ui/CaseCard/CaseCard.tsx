import { Accordion, ScrollArea } from '@urgp/client/shared';
import {
  CaseAuthorTab,
  CaseInfoTab,
  CaseNotesTab,
  ConnectedCasesTab,
  DispatchesTab,
  ExternalCasesTab,
  StagesTab,
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

  return (
    <>
      <CaseCardHeader
        controlCase={controlCase}
        onClose={props.onClose}
        onPrevCase={onPrevCase}
        onNextCase={onNextCase}
      />
      <ScrollArea>
        <Accordion
          type="multiple"
          className="w-full px-4 pb-4"
          defaultValue={['description', 'stages']}
        >
          <CaseInfoTab controlCase={controlCase} label={null} />
          <CaseNotesTab
            controlCase={controlCase}
            contentClassName=""
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
          <StagesTab controlCase={controlCase} accordionItemName="stages" />
        </Accordion>
      </ScrollArea>
      <CaseCardFooter controlCase={controlCase} />
    </>
  );
};

export { CaseCard };
