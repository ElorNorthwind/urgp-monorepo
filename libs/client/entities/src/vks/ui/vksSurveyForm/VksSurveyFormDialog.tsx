import {
  cn,
  selectVksSurveyFormState,
  selectVksSurveyFormValues,
  setSurveyFormState,
  setSurveyFormValuesEmpty,
  setSurveyFormValuesFromDto,
} from '@urgp/client/shared';
import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import {
  housingConfig,
  updateDgiVksSurveyHousingFormSchema,
  UpdateDgiVksSurveyHousingForm,
} from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { VksSurveyFormFieldArray } from './vksSurveyFormFieldArray';
import { useUpdateVksDgiSurvey } from '../../api/vksApi';

type VksSurveyFormDialogProps = {
  className?: string;
};

const VksSurveyFormDialog = ({
  className,
}: VksSurveyFormDialogProps): JSX.Element | null => {
  const isEdit = useSelector(selectVksSurveyFormState) === 'edit';

  const dialogProps = {
    isEdit,
    entityType: 'case',
    dto: updateDgiVksSurveyHousingFormSchema,
    valuesSelector: selectVksSurveyFormValues,
    stateSelector: selectVksSurveyFormState,
    stateDispatch: setSurveyFormState,
    valuesEmptyDispatch: setSurveyFormValuesEmpty,
    valuesDtoDispatch: setSurveyFormValuesFromDto,
    updateHook: useUpdateVksDgiSurvey,
    createHook: useUpdateVksDgiSurvey,
    deleteHook: useUpdateVksDgiSurvey,
    FieldsArray: (props: any) => (
      <VksSurveyFormFieldArray
        {...props}
        config={housingConfig}
        popoverMinWidth="100px"
      />
    ),
    dialogWidth: '700px',
    className: cn(className),
    createTitle: 'Заполнить анкету',
    editTitle: 'Редактировать анкету',
    createDescription: 'Внесите данные о консультации',
    editDescription: 'Измените данные о консультации',
  } as unknown as FormDialogProps<UpdateDgiVksSurveyHousingForm>;

  return <FormDialog {...dialogProps} />;
};

export { VksSurveyFormDialog };
