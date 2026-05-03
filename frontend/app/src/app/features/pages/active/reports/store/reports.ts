import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { ApiService } from '../../../../../core/service/api/api';
import { loadStateEntity$ } from '../../../../../shared/loadStateFunction';
import {
  ReportsByMemberResponse,
  ReportsByProjectResponse,
  ReportsDailyQuery,
  ReportsDailyResponse,
  ReportsPageData,
  ReportsPeriodQuery,
  ReportsSummaryResponse,
} from '../model/reports';
import {BuildQuery} from '../../../../../core/service/api/query';

const initialState: ReportsPageData = {
  summary: {
    data: null,
    loading: true,
    error: null,
  },
  byProject: {
    data: null,
    loading: true,
    error: null,
  },
  byMember: {
    data: null,
    loading: true,
    error: null,
  },
  daily: {
    data: null,
    loading: true,
    error: null,
  },
};


export const ReportsPageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    summaryReport: computed(() => state.summary()?.data),
    reportsByProject: computed(() => state.byProject()?.data?.filteredProjects ?? []),
    reportsByMember: computed(() => state.byMember()?.data?.members ?? []),
    dailyReports: computed(() => state.daily()?.data),
  })),
  withMethods((state) => {
    const api = inject(ApiService);
    const buildQuery = inject(BuildQuery);

    return {
      loadSummary: rxMethod<ReportsPeriodQuery>(
        pipe(
          switchMap((payload) => {
            const query = buildQuery.buildQuery({
              startTime: payload.startTime,
              endTime: payload.endTime,
            });

            return loadStateEntity$<ReportsSummaryResponse | null>({
              patchSlice: (updater) => patchState(state, { summary: updater(state.summary()) }),
              fetch$: () =>
                api.get<ReportsSummaryResponse | null>(
                  `/api/v1/reports/summary${query}`,
                ),
              mapError: (err) => `Ошибка при попытке получить сводный отчет: ${err}`
            });
          }),
        ),
      ),

      loadByProject: rxMethod<ReportsPeriodQuery>(
        pipe(
          switchMap((payload) => {
            const query = buildQuery.buildQuery({
              startTime: payload.startTime,
              endTime: payload.endTime,
            });

            return loadStateEntity$<ReportsByProjectResponse | null>({
              patchSlice: (updater) => patchState(state, { byProject: updater(state.byProject()) }),
              fetch$: () =>
                api.get<ReportsByProjectResponse | null>(
                  `/api/v1/reports/by-project${query}`,
                ),
              mapError: (err) => `Ошибка при попытке получить отчет по проектам: ${err}`
            });
          }),
        ),
      ),

      loadByMember: rxMethod<ReportsPeriodQuery>(
        pipe(
          switchMap((payload) => {
            const query = buildQuery.buildQuery({
              startTime: payload.startTime,
              endTime: payload.endTime,
            });

            return loadStateEntity$<ReportsByMemberResponse | null>({
              patchSlice: (updater) => patchState(state, { byMember: updater(state.byMember()) }),
              fetch$: () =>
                api.get<ReportsByMemberResponse | null>(
                  `/api/v1/reports/by-member${query}`,
                ),
              mapError: (err) => `Ошибка при попытке получить отчет по участникам: ${err}`
            });
          }),
        ),
      ),

      loadDaily: rxMethod<ReportsDailyQuery>(
        pipe(
          switchMap((payload) => {
            const query = buildQuery.buildQuery({
              startTime: payload.startTime,
              endTime: payload.endTime,
              day: payload.day,
            });

            return loadStateEntity$<ReportsDailyResponse | null>({
              patchSlice: (updater) => patchState(state, { daily: updater(state.daily()) }),
              fetch$: () =>
                api.get<ReportsDailyResponse | null>(`/api/v1/reports/daily${query}`),
              mapError: (err) => `Ошибка при попытке получить дневной отчет: ${err}`
            });
          }),
        ),
      ),
    };
  }),
);
