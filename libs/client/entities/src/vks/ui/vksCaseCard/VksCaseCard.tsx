import {
  Accordion,
  ScrollArea,
  useAuth,
  useIsMobile,
  useVksAbility,
} from '@urgp/client/shared';
import {
  VksCaseClientInfoTab,
  VksCaseInfoTab,
  VksCaseOperatorInfoTab,
} from '@urgp/client/widgets';
import { useVksCaseDetails, useVksCaseDetailsPublic } from '../../api/vksApi';
import { VksCaseCardHeader } from './VksCaseCardHeader';
import { VksGradeDisqualifyToggle } from '@urgp/client/features';

type VksCaseCardProps = {
  caseId: number;
  onPrevRow?: () => void;
  onNextRow?: () => void;
  onClose?: () => void;
};

const VksCaseCard = (props: VksCaseCardProps): JSX.Element => {
  const { caseId, onNextRow, onPrevRow } = props;
  const user = useAuth();
  const isAuthorized = user?.id && user?.id !== 0 ? true : false;

  const { data: dataAuthorized } = useVksCaseDetails(caseId, {
    skip: !caseId || caseId === 0 || !isAuthorized,
  });

  const { data: dataPublic } = useVksCaseDetailsPublic(caseId, {
    skip: !caseId || caseId === 0 || isAuthorized,
  });

  const data = isAuthorized ? dataAuthorized : dataPublic;

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
          <VksGradeDisqualifyToggle
            className="bg-background mt-4 w-full"
            caseId={caseId}
          />
          <VksCaseClientInfoTab entity={data} accordionItemName="client-info" />
          {data?.operatorSurveyId && (
            <VksCaseOperatorInfoTab
              entity={data}
              accordionItemName="operator-info"
            />
          )}
        </Accordion>
      </ScrollArea>
    </>
  );
};

export { VksCaseCard };
