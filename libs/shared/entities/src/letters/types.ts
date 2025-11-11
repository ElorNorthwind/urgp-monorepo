export type UnchangedResolution = {
  id: number;
  caseNum: string;
  caseDate: string | Date;
  dueDate: string | Date;
  expert: string;
  markedAt: string | Date;
  notifiedAt: string | Date | null;
  edoId: number;
};
