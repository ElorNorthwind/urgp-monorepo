import {
  Accordion,
  Button,
  ScrollArea,
  setSurveyFormCaseId,
  setSurveyFormState,
  useAuth,
  useVksAbility,
} from '@urgp/client/shared';
import {
  VksCaseClientInfoTab,
  VksCaseInfoTab,
  VksCaseOperatorInfoTab,
} from '@urgp/client/widgets';
import { useVksCaseDetails, useVksCaseDetailsPublic } from '../../api/vksApi';
import { VksCaseCardHeader } from './VksCaseCardHeader';
import {
  VksGradeDisqualifyToggle,
  VksSentToYandexToggle,
} from '@urgp/client/features';
import { VksSurveyFormDialog } from '../vksSurveyForm/VksSurveyFormDialog';
import { ClipboardEdit } from 'lucide-react';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const i = useVksAbility();

  const { data: dataAuthorized } = useVksCaseDetails(caseId, {
    skip: !caseId || caseId === 0 || !isAuthorized,
  });

  const { data: dataPublic } = useVksCaseDetailsPublic(caseId, {
    skip: !caseId || caseId === 0 || isAuthorized,
  });

  const data = isAuthorized ? dataAuthorized : dataPublic;

  const canFillSurvey = i.can('update', 'VksCase');

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
          <VksSentToYandexToggle
            className="bg-background mt-4 w-full"
            caseId={caseId}
          />
          <VksCaseClientInfoTab entity={data} accordionItemName="client-info" />
          {(data?.operatorSurveyId || data?.caseType === 'ГЛ') && (
            <VksCaseOperatorInfoTab
              entity={data}
              accordionItemName="operator-info"
            />
          )}
          {/* {canFillSurvey && data && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                dispatch(setSurveyFormCaseId(data.id));
                dispatch(
                  setSurveyFormState(data.operatorSurveyId ? 'edit' : 'create'),
                );
              }}
            >
              <ClipboardEdit className="mr-2 size-4" />
              {data?.operatorSurveyId
                ? 'Редактировать анкету'
                : 'Заполнить анкету'}
            </Button>
          )} */}
        </Accordion>
      </ScrollArea>
    </>
  );
};

export { VksCaseCard };
