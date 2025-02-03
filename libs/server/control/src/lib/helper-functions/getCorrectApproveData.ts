import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  ApproveControlEntityDto,
  ApproveStatus,
  CreateCaseDto,
  defineControlAbilityFor,
  UpdateCaseDto,
  User,
} from '@urgp/shared/entities';

type approversProps = {
  user: User;
  dto: ApproveControlEntityDto | CreateCaseDto | UpdateCaseDto;
};

export const getCorrectApproveData = ({
  user,
  dto,
  // current,
}: approversProps) => {
  const i = defineControlAbilityFor(user);

  if (i.cannot('set-approver', dto)) {
    Logger.warn(
      'Согласующий недоступен',
      JSON.stringify({
        dtoApproveToId: dto?.approveToId,
        userFio: user.fio,
        userApprovers: user.controlData?.approvers?.cases,
      }),
    );
    throw new UnauthorizedException('Согласующий недоступен');
  }

  if (dto.approveStatus === 'rejected') {
    return {
      approveStatus: 'rejected' as ApproveStatus,
      approveFromId: user.id,
      approveToId: dto?.approveToId || null, // Не забыть прокинуть сюда id направившего согл!
      approveDate: new Date().toISOString(),
      approveNotes: dto?.approveNotes || null,
    };
  }

  return !dto.approveToId || dto.approveToId === 0
    ? {
        // Проект не направляется на согласование
        approveStatus: 'project' as ApproveStatus,
        approveFromId: null,
        approveToId: null,
        approveDate: null,
        approveNotes: null,
      }
    : dto.approveToId === user.id
      ? {
          // Проект одобрен автором
          approveStatus: 'approved' as ApproveStatus,
          approveFromId: user.id,
          approveToId: user.id,
          approveDate: new Date().toISOString(),
          approveNotes: 'Одоберно автором при создании заявки',
        }
      : {
          // Направлено указанному согласующему
          approveStatus: 'pending' as ApproveStatus,
          approveFromId: user.id,
          approveToId: dto.approveToId,
          approveDate: null,
          approveNotes: null,
        };
};
