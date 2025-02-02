import { EntityApproveData } from '@urgp/shared/entities';

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

export const getApproveInfo = (payload: EntityApproveData): ApproveInfo => {
  const approveText = statusTextVariants[payload?.approveStatus];
  const currentFio = payload?.approveTo?.fio;
  const previousFio = payload?.approveFrom?.fio;
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
