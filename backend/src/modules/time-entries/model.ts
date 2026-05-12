export interface CreateTimeEntryDTO {
  taskId: string;
}

export interface UpdateTimeEntryDTO {
  timeEntryId: string;
  taskId?: string;
}

export interface DeleteTimeEntryDTO {
  timeEntryId: string;
}

export interface StartTimeEntryDTO {
  taskId: string;
}

export interface EndTimeEntryDTO {
  timeEntryId?: string;
}
