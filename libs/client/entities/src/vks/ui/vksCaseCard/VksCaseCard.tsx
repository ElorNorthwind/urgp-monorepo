import {
  Accordion,
  EQUITY_SIDEBAR_WIDTH,
  ScrollArea,
  useIsMobile,
} from '@urgp/client/shared';
import {
  EquityClaimsArchiveTab,
  EquityClaimsTab,
  EquityEgrnTab,
  EquityObjectInfoTab,
  EquityOperationsTab,
  VksCaseInfoTab,
} from '@urgp/client/widgets';
import { EquityObject, VksCase } from '@urgp/shared/entities';
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
          defaultValue={['operations', 'claims']}
        >
          <VksCaseInfoTab entity={data} />
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
