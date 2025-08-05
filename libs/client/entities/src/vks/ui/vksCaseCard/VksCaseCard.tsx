import { Accordion, ScrollArea, useIsMobile } from '@urgp/client/shared';
import {
  VksCaseClientInfoTab,
  VksCaseInfoTab,
  VksCaseOperatorInfoTab,
} from '@urgp/client/widgets';
import { useVksCaseDetails } from '../../api/vksApi';
import { VksCaseCardHeader } from './VksCaseCardHeader';

type VksCaseCardProps = {
  caseId: number;
  onPrevRow?: () => void;
  onNextRow?: () => void;
  onClose?: () => void;
};

const VksCaseCard = (props: VksCaseCardProps): JSX.Element => {
  const { caseId, onNextRow, onPrevRow } = props;

  const { data, isLoading, isFetching } = useVksCaseDetails(caseId, {
    skip: !caseId || caseId === 0,
  });

  const isMobile = useIsMobile();

  return (
    <>
      <VksCaseCardHeader
        entity={data}
        onClose={props.onClose}
        onPrevRow={onPrevRow}
        onNextRow={onNextRow}
      />
      <ScrollArea className="w-full">
        <Accordion
          type="multiple"
          className="w-full px-4 pb-4"
          defaultValue={['client-info', 'operator-info']}
        >
          <VksCaseInfoTab entity={data} />
          <VksCaseClientInfoTab entity={data} accordionItemName="client-info" />
          {data?.operatorSurveyId && (
            <VksCaseOperatorInfoTab
              entity={data}
              accordionItemName="operator-info"
            />
          )}
          {/* <VksCaseInfoTab equityObject={equityObject} />
          <EquityEgrnTab equityObject={equityObject} accordionItemName="egrn" />
          <EquityClaimsTab
            equityObject={equityObject}
            accordionItemName="claims"
          />
          <EquityClaimsArchiveTab
            equityObject={equityObject}
            accordionItemName="claims-archive"
          />
          <EquityOperationsTab
            equityObject={equityObject}
            accordionItemName="operations"
          /> */}
        </Accordion>
      </ScrollArea>
    </>
  );
};

export { VksCaseCard };
