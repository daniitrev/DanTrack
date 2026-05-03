import { HttpEntity } from '../../../../../shared/loadStateFunction';

export interface TimeEntryItem {
  timeEntryId: string;
  taskId: string;
  workerId: string;
  startTime?: Date | string | null;
  endTime?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TimeEntryListResponse {
  timeEntries: TimeEntryItem[];
}

export interface TimeEntryDetailResponse {
  timeEntry: TimeEntryItem;
}

export interface GetTimeEntriesPayload {
  taskId?: string;
}

export interface CreateTimeEntryPayload {
  taskId: string;
  startTime?: string;
  endTime?: string;
}

export interface UpdateTimeEntryPayload {
  timeEntryId: string;
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

export interface TimeEntryData {
  page: HttpEntity<TimeEntryListResponse | null>;
  currentTimeEntry: HttpEntity<TimeEntryDetailResponse | null>;
}

export type TimeEntryPage = TimeEntryListResponse;
export type TimeEntryActions = CreateTimeEntryPayload;
export type TaskPageQuery = GetTimeEntriesPayload;
