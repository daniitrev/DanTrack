import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import environments from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiConfig {
  constructor() {}
  BASE_URL = environments.baseUrl;
}
