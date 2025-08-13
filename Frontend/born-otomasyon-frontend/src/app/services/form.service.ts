import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormDataRequest, FormDataResponse } from '../models/form.models';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'http://localhost:5159/api/form';

  constructor(private http: HttpClient) { }

  submitForm(data: FormDataRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getUserForms(): Observable<FormDataResponse[]> {
    return this.http.get<FormDataResponse[]>(`${this.apiUrl}`);
  }
}
