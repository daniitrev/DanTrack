import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly http = inject(HttpClient);
  readonly config = inject(ApiConfig);
  private readonly baseUrl = this.config.BASE_URL;

  get<T>(url: string) {
    return this.http.get<T>(this.toUrl(url), { withCredentials: true });
  }

  post<TResponse, TPayload = unknown>(url: string, payload?: TPayload) {
    return this.http.post<TResponse>(this.toUrl(url), payload, { withCredentials: true });
  }

  patch<TResponse, TPayload>(url: string, payload: TPayload) {
    return this.http.patch<TResponse>(this.toUrl(url), payload, { withCredentials: true });
  }

  put<TResponse, TPayload>(url: string, payload: TPayload) {
    return this.http.put<TResponse>(this.toUrl(url), payload, { withCredentials: true });
  }

  delete<T>(url: string) {
    return this.http.delete<T>(this.toUrl(url), { withCredentials: true });
  }

  private toUrl(url: string) {
    return `${this.baseUrl}${url}`;
  }
}
