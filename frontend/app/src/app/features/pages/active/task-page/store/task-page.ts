import {
  CreateTaskPayload,
  DeleteTaskPayload,
  DeleteTaskResponse,
  GetTaskByIdPayload,
  GetTaskListPayload, TaskDetailResponse, TaskListResponse,
  TaskPageData, UpdateTaskPayload, UpdateTaskPriorityPayload
} from '../model/task-page';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed, inject} from '@angular/core';
import {ApiService} from '../../../../../core/service/api/api';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap} from 'rxjs';
import {loadStateEntity$} from '../../../../../shared/loadStateFunction';


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
}


export const TaskPageStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    taskPage: computed(() => state.page()?.data?.tasks)
  })),

  withMethods((state) => {
    const api = inject(ApiService)

    return{
      loadPage: rxMethod<void>(
        pipe(
          switchMap(() => {
            return loadStateEntity$<TaskListResponse | null>({
              patchSlice: updater =>  patchState(state, { page: updater(state.page())}),
              fetch$: () => api.get<TaskListResponse | null>("/api/v1/projects/:projectId/tasks"),
              mapError: (err) => `Ошибка при попытки получить все задачи ${err}`
            })
          })
        )
      ),

      createTask: rxMethod<CreateTaskPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$< TaskListResponse | null>({
              patchSlice: updater =>  patchState(state, { page: updater(state.page())}),
              fetch$: () => api.post<TaskListResponse | null>(`/api/v1/projects/${payload.projectId}/tasks`, payload),
              mapError: (err) => `Ошибка при попытке создать задачу ${err}`
            })
          })
        )
      ),

      getTaskById: rxMethod<GetTaskByIdPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskDetailResponse | null>({
              patchSlice: updater =>  patchState(state, { currentTask: updater(state.currentTask())}),
              fetch$: () => api.get<TaskDetailResponse | null>(`/api/v1/projects/${payload.projectId}/tasks`),
              mapError: (err) => `Ошибка при попытке получить задачу ${err}`
            })
          })
        )
      ),

      updateTask: rxMethod<UpdateTaskPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskDetailResponse | null>({
              patchSlice: updater =>  patchState(state, { currentTask: updater(state.currentTask())}),
              fetch$: () => api.patch<TaskDetailResponse | null, UpdateTaskPayload>(`/api/v1/tasks/${payload.taskId}`, payload),
              mapError: (err) => `Ошибка при попытке обновить задачу ${err}`
            })
          })
        )
      ),
      deleteTask: rxMethod<DeleteTaskPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskDetailResponse | null>({
              patchSlice: updater =>  patchState(state, { currentTask: updater(state.currentTask())}),
              fetch$: () => api.delete<TaskDetailResponse | null>(`/api/v1/tasks/${payload.taskId}`),
              mapError: (err) => `Ошибка при попытке удалить задачу ${err}`
            })
          })
        )
      ),

      updateTaskPriority: rxMethod<UpdateTaskPriorityPayload>(
        pipe(
          switchMap((payload) => {
            return loadStateEntity$<TaskDetailResponse | null>({
              patchSlice: updater =>  patchState(state, { currentTask: updater(state.currentTask())}),
              fetch$: () => api.patch<TaskDetailResponse | null, UpdateTaskPriorityPayload>(`/api/v1/tasks/${payload.taskId}/priority`, payload),
              mapError: (err) => `Ошибка при попытке обновить приоритет задачи ${err}`
            })
          })
        )
      ),
    }
  })
)
