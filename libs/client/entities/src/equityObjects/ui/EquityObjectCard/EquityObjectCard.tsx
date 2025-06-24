import { Accordion, ScrollArea } from '@urgp/client/shared';
import {
  CaseAuthorTab,
  CaseInfoTab,
  CaseNotesTab,
  ConnectedCasesTab,
  DispatchesTab,
  EquityClaimsTab,
  EquityObjectInfoTab,
  ExternalCasesTab,
  StagesTab,
} from '@urgp/client/widgets';
import {
  CaseFull,
  EquityObject,
  OperationClasses,
} from '@urgp/shared/entities';
import { StagesHeader, StagesList, useOperations } from '../../../operations';
import { EquityObjectCardHeader } from './EquityObjectCardHeader';

type EquityObjectCardProps = {
  equityObject: EquityObject;
  onPrevRow?: () => void;
  onNextRow?: () => void;
  onClose?: () => void;
};

const EquityObjectCard = (props: EquityObjectCardProps): JSX.Element => {
  const { equityObject, onNextRow, onPrevRow } = props;

  return (
    <>
      <EquityObjectCardHeader
        equityObject={equityObject}
        onClose={props.onClose}
        onPrevRow={onPrevRow}
        onNextRow={onNextRow}
      />
      <ScrollArea>
        <Accordion
          type="multiple"
          className="w-full px-4 pb-4"
          defaultValue={['description', 'claims']}
        >
          <EquityObjectInfoTab
            equityObject={equityObject}
            contentClassName=""
            // accordionItemName="description"
          />
          <EquityClaimsTab
            equityObject={equityObject}
            contentClassName=""
            accordionItemName="claims"
          />

          {/* <CaseInfoTab controlCase={controlCase} label={null} />
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
          <StagesTab controlCase={controlCase} accordionItemName="stages" /> */}
        </Accordion>
      </ScrollArea>
      {/* <EquityObjectCardFooter controlCase={controlCase} /> */}
    </>
  );
};

export { EquityObjectCard };
