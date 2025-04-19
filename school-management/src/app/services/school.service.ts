import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SchoolDto } from '../models/school/school-dto';
import { SchoolResponse } from '../models/school/school-response';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly api = `${environment.urlBaseApi}api/V1/school`;

  constructor(private readonly http: HttpClient) { }

  add(request: SchoolDto): Observable<SchoolDto> {
    return this.http.post<SchoolDto>(this.api, request);
  }

  getById(code: number): Observable<SchoolResponse> {
    return this.http.get<SchoolResponse>(`${this.api}/${code}`);
  }

  getAll(description?: string): Observable<{ data: SchoolResponse[] }> {
    let params = new HttpParams();
    if (description) {
      params = params.set('description', description);
    }
    return this.http.get<{ data: SchoolResponse[] }>(this.api, { params });
  }

  update(code: number, request: SchoolDto): Observable<SchoolDto> {
    return this.http.put<SchoolDto>(`${this.api}?code=${code}`, request);
  }

  delete(code: number): Observable<void> {
    return this.http.delete<void>(`${this.api}?code=${code}`);
  }
}