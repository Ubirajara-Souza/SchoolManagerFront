import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentDto } from '../models/students/student-dto';
import { StudentResponse } from '../models/students/student-response';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly api = `${environment.urlBaseApi}api/V1/student`;

  constructor(private readonly http: HttpClient) { }

  add(request: StudentDto): Observable<StudentDto> {
    return this.http.post<StudentDto>(this.api, request);
  }

  getById(code: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.api}/${code}`);
  }

  getAll(name?: string, cpf?: string): Observable<{ data: StudentResponse[] }> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (cpf) params = params.set('cpf', cpf);
    return this.http.get<{ data: StudentResponse[] }>(this.api, { params });
  }

  update(code: number, request: StudentDto): Observable<StudentDto> {
    return this.http.put<StudentDto>(`${this.api}?code=${code}`, request);
  }

  delete(code: number): Observable<void> {
    return this.http.delete<void>(`${this.api}?code=${code}`);
  }
}