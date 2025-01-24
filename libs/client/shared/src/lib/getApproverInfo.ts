import { ApproveStatusData } from '@urgp/shared/entities';

const statusTextVariants = {
  pending: 'На утверждении',
  approved: 'Утверждено',
  rejected: 'Не согласовано',
} as const;

type ApproveInfo = {
  approveText?: (typeof statusTextVariants)[keyof typeof statusTextVariants];
  currentFio?: string;
  previousFio?: string;
  approveNotes?: string;
  rejectNotes?: string;
};

export const getApproveInfo = (payload: ApproveStatusData): ApproveInfo => {
  const approveText = statusTextVariants[payload?.approveStatus];
  const currentFio =
    payload?.approveStatus === 'pending'
      ? payload?.approver?.fio
      : payload?.approveBy?.fio;
  const previousFio =
    payload?.approveStatus === 'pending' &&
    payload?.approveBy?.id !== payload?.approver?.id
      ? payload?.approveBy?.fio
      : undefined;
  return {
    approveText,
    currentFio,
    previousFio,
    approveNotes:
      payload?.approveStatus === 'approved' ? payload?.approveNotes : undefined,
    rejectNotes:
      payload?.approveStatus === 'rejected' ? payload?.approveNotes : undefined,
  };
};
