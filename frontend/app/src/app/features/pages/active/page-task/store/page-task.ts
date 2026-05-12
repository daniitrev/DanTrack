import {
  CreateTaskPayload,
  DeleteTaskPayload,
  GetTaskByIdPayload,
  GetTaskListPayload,
  TaskDetailResponse,
  TaskListResponse,
  TaskPageData,
  UpdateTaskPayload,
} from '../model/page-task';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { ApiService } from '../../../../../core/service/api/api';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { loadStateEntity$ } from '../../../../../shared/loadStateFunction';

const initialState: TaskPageData = {
  page: {
    data: null,
    loading: true,
    error: null,
  },
  currentTask: {
    data: null,
    loading: true,
    error: null,
  },
};

export const TaskPageStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    taskPage: computed(() => state.page()?.data?.tasks),
    currentTaskData: computed(() => state.currentTask()?.data?.task ?? null),
  })),

  withMethods((state) => {
    const api = inject(ApiService);

    return {
      loadPage: rxMethod<GetTaskListPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskListResponse | null>({
              patchSlice: (updater) => patchState(state, { page: updater(state.page()) }),
              fetch$: () =>
                api.get<TaskListResponse | null>(`/api/v1/projects/${payload.projectId}/tasks`),
              mapError: (err) => `Ошибка при попытки получить все задачи ${err}`,
            });
          }),
        ),
      ),

      createTask: rxMethod<CreateTaskPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskListResponse | null, TaskDetailResponse | null>({
              patchSlice: (updater) => patchState(state, { page: updater(state.page()) }),
              fetch$: () =>
                api.post<TaskDetailResponse | null, CreateTaskPayload>(
                  `/api/v1/projects/${payload.projectId}/tasks`,
                  payload,
                ),
              mapData: () => state.page().data,
              mapError: (err) => `Ошибка при попытке создать задачу ${err}`,
              onSuccess: (response) => {
                const createdTask = response?.task;
                if (!createdTask) return;

                patchState(state, (currentState) => ({
                  page: {
                    ...currentState.page,
                    data: {
                      tasks: [...(currentState.page.data?.tasks ?? []), createdTask],
                    },
                  },
                }));
              },
            });
          }),
        ),
      ),

      getTaskById: rxMethod<GetTaskByIdPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTask: updater(state.currentTask()) }),
              fetch$: () =>
                api.get<TaskDetailResponse | null>(`/api/v1/tasks/${payload.taskId}`),
              mapError: (err) => `Ошибка при попытке получить задачу ${err}`,
            });
          }),
        ),
      ),

      updateTask: rxMethod<UpdateTaskPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTask: updater(state.currentTask()) }),
              fetch$: () =>
                api.patch<TaskDetailResponse | null, UpdateTaskPayload>(
                  `/api/v1/tasks/${payload.taskId}`,
                  payload,
                ),
              mapError: (err) => `Ошибка при попытке обновить задачу ${err}`,
              onSuccess: (response) => {
                if (!response?.task) return;

                patchState(state, (currentState) => ({
                  page: {
                    ...currentState.page,
                    data: {
                      tasks: (currentState.page.data?.tasks ?? []).map((task) =>
                        task.taskId === response.task?.taskId ? response.task : task,
                      ),
                    },
                  },
                }));
              },
            });
          }),
        ),
      ),
      deleteTask: rxMethod<DeleteTaskPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskDetailResponse | null>({
              patchSlice: (updater) =>
                patchState(state, { currentTask: updater(state.currentTask()) }),
              fetch$: () =>
                api.delete<TaskDetailResponse | null>(`/api/v1/tasks/${payload.taskId}`),
              mapError: (err) => `Ошибка при попытке удалить задачу ${err}`,
              onSuccess: () => {
                patchState(state, (currentState) => ({
                  page: {
                    ...currentState.page,
                    data: {
                      tasks: (currentState.page.data?.tasks ?? []).filter(
                        (task) => task.taskId !== payload.taskId,
                      ),
                    },
                  },
                  currentTask: {
                    ...currentState.currentTask,
                    data:
                      currentState.currentTask.data?.task?.taskId === payload.taskId
                        ? null
                        : currentState.currentTask.data,
                  },
                }));
              },
            });
          }),
        ),
      ),
    };
  }),
);
