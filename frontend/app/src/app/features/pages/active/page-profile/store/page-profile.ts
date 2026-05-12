import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { ApiService } from '../../../../../core/service/api/api';
import { loadStateEntity$ } from '../../../../../shared/loadStateFunction';
import {
  UpdateProfilePayload,
  UpdateProfileResponse,
  UserProfile,
  UserProfilePageData,
  UserProfileResponse,
} from '../model/page-profile';

const initialState: UserProfilePageData = {
  page: {
    data: null,
    loading: false,
    error: null,
  },
};

export const ProfilePageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    profile: computed(() => state.page().data),
  })),
  withMethods((state) => {
    const api = inject(ApiService);

    return {
      loadPage: rxMethod<void>(
        pipe(
          switchMap(() =>
            loadStateEntity$<UserProfile | null>({
              patchSlice: (updater) => patchState(state, { page: updater(state.page()) }),
              fetch$: () => api.get<UserProfile>('/api/v1/user'),
              mapError: (err) => `Ошибка при попытке получить профиль пользователя ${err}`,
            }),
          ),
        ),
      ),

      updateProfile: rxMethod<UpdateProfilePayload>(
        pipe(
          switchMap((payload) =>
            loadStateEntity$<UserProfile | null, UpdateProfileResponse>({
              patchSlice: (updater) => patchState(state, { page: updater(state.page()) }),
              fetch$: () =>
                api.patch<UpdateProfileResponse, UpdateProfilePayload>('/api/v1/update', payload),
              mapError: (err) => `Ошибка при попытке обновить профиль пользователя ${err}`,
            }),
          ),
        ),
      ),
    };
  }),
);
