import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  AddMemberToCurrentProject,
  CreateProject,
  CreateProjectResponse,
  ProjectDetailResponse,
  ProjectPage,
  ProjectPageData,
  ProjectPageResponse,
  ProjectUpdate,
} from '../model/project-page';
import { computed, inject } from '@angular/core';
import { ApiService } from '../../../../../core/service/api/api';
import { loadStateEntity$ } from '../../../../../shared/loadStateFunction';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap } from 'rxjs';

const initialState: ProjectPageData = {
  page: {
    data: null,
    loading: true,
    error: null,
  },
  project: {
    data: null,
    loading: true,
    error: null,
  },
  member: {
    data: null,
    loading: true,
    error: null,
  }
};
export const ProjectPageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    projectPage: computed(() => store.page()?.data?.projects),
    currentProject: computed(() =>  store.project()?.data?.project),
    tasks: computed(() => store.project().data?.tasks),
  })),

  withMethods((state) => {
    const api = inject(ApiService);
    const methods = {
      loadPage: rxMethod<void>(
        pipe(
          switchMap((store) => {
            return loadStateEntity$<ProjectPageResponse | null>({
              patchSlice: (updater) => patchState(state, { page: updater(state.page()) }),
              fetch$: () => api.get<ProjectPageResponse | null>('/api/v1/projects'),
              mapError: (err) => `Ошибки при попытки получить список проектов пользователя ${err}`,
            });
          }),
        ),
      ),

      createProject: rxMethod<CreateProject>(
        pipe(
          exhaustMap((payload) => {
            return loadStateEntity$<
              ProjectPageResponse | null,
              CreateProjectResponse | null
            >({
              patchSlice: (updater) => patchState(state, { page: updater(state.page()) }),
              fetch$: () =>
                api.post<CreateProjectResponse | null, CreateProject>(
                  '/api/v1/projects',
                  payload,
                ),
              mapData: () => state.page().data,
              mapError: (err) => `Ошибка при попытки создать проект ${err}`,
              onSuccess: () => methods.loadPage(),
            });
          }),
        ),
      ),

      detailOfProject: rxMethod<ProjectPage>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<ProjectDetailResponse | null>({
              patchSlice: (updater) => patchState(state, { project: updater(state.project()) }),
              fetch$: () => api.get<ProjectDetailResponse | null>(`/api/v1/projects/${payload.projectId}`),
              mapError: (err) => `Ошибка при попытке получить детали проекта ${err}`,
            });
          }),
        ),
      ),

      updateProject: rxMethod<ProjectUpdate>(
        pipe(
          switchMap(( payload) => {
            return loadStateEntity$<ProjectDetailResponse | null>({
              patchSlice: (updater) => patchState(state, { project: updater(state.project()) }),
              fetch$: () => api.patch<ProjectDetailResponse | null, ProjectUpdate>(`/api/v1/projects/${payload.projectId}`, payload),
              mapError: (err) => `Ошибка при попытке обновить проект ${err}`,
            })
          })
        )
      ),
      deleteProject: rxMethod<ProjectPage>(
        pipe(
          switchMap(( payload) => {
            return loadStateEntity$<ProjectDetailResponse | null>({
              patchSlice: (updater) => patchState(state, { project: updater(state.project()) }),
              fetch$: () => api.delete<ProjectDetailResponse | null>(`/api/v1/projects/${payload.projectId}`),
              mapError: (err) => `Ошибка при попытке удалить проект ${err}`,
            })
          })
        )
      ),
      addMemberToCurrentProject: rxMethod<AddMemberToCurrentProject>(
        pipe(
          switchMap(( payload) => {
            return loadStateEntity$<ProjectPage | null>({
              patchSlice: (updater) => patchState(state, { member: updater(state.member()) }),
              fetch$: () =>
                api.post<ProjectPage, AddMemberToCurrentProject>(
                  `/api/v1/projects/${payload.projectId}/members`,
                  payload,
                ),
              mapError: (err) => `Ошибка при попытке добавить участника в проект ${err}`,
            })
          })
        )
      )
    };

    return methods;
  }),
);
