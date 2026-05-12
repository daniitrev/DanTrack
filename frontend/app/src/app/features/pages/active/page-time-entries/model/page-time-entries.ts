import { HttpEntity } from '../../../../../shared/loadStateFunction';

export interface TimeEntryItem {
  timeEntryId: string;
  taskId: string;
  workerId: string;
  title: string;
  startTime?: Date  | null;
  endTime?: Date | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TimeEntryListResponse {
  timeEntries: TimeEntryItem[];
}

export interface TimeEntryDetailResponse {
  timeEntry: TimeEntryItem;
}

export interface CreateTimeEntryPayload {
  taskId: string;
}

export interface UpdateTimeEntryPayload {
  timeEntryId?: string;
  taskId?: string;
  startTime?: string;
  endTime?: string;
}

export interface DeleteTimeEntryPayload {
  timeEntryId: string;
}

export interface StartTimeEntryPayload {
  taskId: string;
}

export interface EndTimeEntryPayload {
  timeEntryId: string;
}
export interface TimeEntryData {
  page: HttpEntity<TimeEntryListResponse | null>;
  currentTimeEntry: HttpEntity<TimeEntryDetailResponse | null>;
}

