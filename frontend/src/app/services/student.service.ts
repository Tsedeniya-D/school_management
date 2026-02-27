import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class StudentService {
  private apiUrl = `${environment.apiUrl}/student`;

  constructor(private http: HttpClient) { }

  getGrades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grades`);
  }

  getSubjectGrades(subjectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grades/${subjectId}`);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }
}
