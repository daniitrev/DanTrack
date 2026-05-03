import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { ApiService } from '../../../../../core/service/api/api';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { loadStateEntity$ } from '../../../../../shared/loadStateFunction';
import {
  CreateTimeEntryPayload,
  DeleteTimeEntryPayload,
  GetTimeEntriesPayload,
  StartTimeEntryPayload,
  TimeEntryData,
  TimeEntryDetailResponse,
  TimeEntryListResponse,
  UpdateTimeEntryPayload,
} from '../model/task-entries';
import { BuildQuery } from '../../../../../core/service/api/query';


const initialState: TimeEntryData = {
  page: {
    data: null,
    loading: true,
    error: null,
  },
  currentTimeEntry: {
    data: null,
    loading: true,
    error: null,
  },
};

export const TimeEntryPageStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    timeEntryPage: computed(() => state.page()?.data),
    currentTimeEntryData: computed(() => state.currentTimeEntry()?.data),
  })),
  withMethods((state) => {
    const api = inject(ApiService);
    const buildQuery = inject(BuildQuery);

    return {
      loadPage: rxMethod<GetTimeEntriesPayload>(
        pipe(
          switchMap((payload) => {
            const query = buildQuery.buildQuery({
              taskId: payload.taskId,
            });

            return loadStateEntity$<TimeEntryListResponse | null>({
              patchSlice: (updater) => patchState(state, { page: updater(state.page()) }),
              fetch$: () =>
                api.get<TimeEntryListResponse | null>(
                  `/api/v1/time-entries${query}`,
                ),
              mapError: (err) => `Ошибка при попытке получить список записей времени ${err}`,
            });
          }),
        ),
      ),

      createTimeEntry: rxMethod<CreateTimeEntryPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TimeEntryDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTimeEntry: updater(state.currentTimeEntry()) }),
              fetch$: () =>
                api.post<TimeEntryDetailResponse | null, CreateTimeEntryPayload>(
                  '/api/v1/time-entries',
                  payload,
                ),
              mapError: (err) => `Ошибка при попытке создать запись времени ${err}`,
            });
          }),
        ),
      ),

      updateTimeEntry: rxMethod<UpdateTimeEntryPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TimeEntryDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTimeEntry: updater(state.currentTimeEntry()) }),
              fetch$: () =>
                api.patch<TimeEntryDetailResponse | null, UpdateTimeEntryPayload>(
                  `/api/v1/time-entries/${payload.timeEntryId}`,
                  payload,
                ),
              mapError: (err) => `Ошибка при попытке обновить запись времени ${err}`,
            });
          }),
        ),
      ),

      deleteTimeEntry: rxMethod<DeleteTimeEntryPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TimeEntryDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTimeEntry: updater(state.currentTimeEntry()) }),
              fetch$: () =>
                api.delete<TimeEntryDetailResponse | null>(
                  `/api/v1/time-entries/${payload.timeEntryId}`,
                ),
              mapError: (err) => `Ошибка при попытке удалить запись времени ${err}`,
            });
          }),
        ),
      ),

      startTimeEntry: rxMethod<StartTimeEntryPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TimeEntryDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTimeEntry: updater(state.currentTimeEntry()) }),
              fetch$: () =>
                api.post<TimeEntryDetailResponse | null, StartTimeEntryPayload>(
                  '/api/v1/time-entries/start',
                  payload,
                ),
              mapError: (err) => `Ошибка при попытке запустить таймер ${err}`,
            });
          }),
        ),
      ),

      stopTimeEntry: rxMethod<void>(
        pipe(
          switchMap(() => {
            return loadStateEntity$<TimeEntryDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTimeEntry: updater(state.currentTimeEntry()) }),
              fetch$: () =>
                api.post<TimeEntryDetailResponse | null>(
                  '/api/v1/time-entries/stop',
                ),
              mapError: (err) => `Ошибка при попытке остановить таймер ${err}`,
            });
          }),
        ),
      ),

      getCurrentTimeEntry: rxMethod<void>(
        pipe(
          switchMap(() => {
            return loadStateEntity$<TimeEntryDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTimeEntry: updater(state.currentTimeEntry()) }),
              fetch$: () =>
                api.get<TimeEntryDetailResponse | null>(
                  '/api/v1/time-entries/current',
                ),
              mapError: (err) => `Ошибка при попытке получить текущую запись времени ${err}`,
            });
          }),
        ),
      ),
    };
  }),
);
