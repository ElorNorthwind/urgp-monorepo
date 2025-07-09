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
} from '@urgp/client/widgets';
import { EquityObject } from '@urgp/shared/entities';
import { EquityObjectCardHeader } from './EquityObjectCardHeader';

type EquityObjectCardProps = {
  equityObject: EquityObject;
  onPrevRow?: () => void;
  onNextRow?: () => void;
  onClose?: () => void;
};

const EquityObjectCard = (props: EquityObjectCardProps): JSX.Element => {
  const { equityObject, onNextRow, onPrevRow } = props;
  const isMobile = useIsMobile();

  return (
    <>
      <EquityObjectCardHeader
        equityObject={equityObject}
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
          <EquityObjectInfoTab equityObject={equityObject} />
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
          />
        </Accordion>
      </ScrollArea>
      {/* <EquityObjectCardFooter controlCase={controlCase} /> */}
    </>
  );
};

export { EquityObjectCard };
