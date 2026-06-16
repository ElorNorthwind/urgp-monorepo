export type DmRecord = {
  resolutionId: number | null;
  resolutionText: string | null;
  controlDate: string | null;
  doneDate: string | null;
  documentId: number | null;
  registrationNumber: string | null;
  fromFio: string | null;
  registrationDate: string | null;
  categoryId: number | null;
  planDueDate: string | null;
};

export type DmSuspence = {
  documentId: number;
  techStageId: number;
  stageName: string | null;
  startDate: string | null;
  dueDate: string | null;
  doneDate: string | null;
  termValue: number | null;
  termType: string | null;
};
