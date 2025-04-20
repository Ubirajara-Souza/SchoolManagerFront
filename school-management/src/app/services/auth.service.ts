import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUserDto } from '../models/auth/login-user-dto';
import { RegisterUserDto } from '../models/auth/register-user-dto';
import { AddClaimDto } from '../models/auth/add-claim-dto';
import { LoginResponse } from '../models/auth/login-response';
import { RefreshTokenUserDto } from 'app/models/auth/refresh-token-user-dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.urlBaseApi}api/V1/auth`;

  constructor(private readonly http: HttpClient) { }

  register(data: RegisterUserDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/new-account`, data).pipe(
      tap((res: any) => {
        if (res?.data?.userToken?.email) {
          localStorage.setItem('userEmail', res.data.userToken.email);
        }
      })
    );
  }

  login(data: LoginUserDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, data).pipe(
      tap((res: any) => {
        if (res?.data?.accessToken) {
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('userEmail', res.data.userToken.email);
        }
      })
    );
  }

  addClaim(data: AddClaimDto): Observable<void> {
    return this.http.post<void>(`${this.api}/add-claim`, data);
  }

  refreshToken(data: RefreshTokenUserDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/refresh-token`, data).pipe(
      tap((res: any) => {
        if (res?.data?.accessToken) {
          localStorage.setItem('accessToken', res.data.accessToken);
        }
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.api}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
      })
    );
  }
}