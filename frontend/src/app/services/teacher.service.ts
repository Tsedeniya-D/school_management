import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/teacher`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token || ''}`
      })
    };
  }

  getStudents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students`, this.getHeaders());
  }

  getStudent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${id}`, this.getHeaders());
  }

  getMarks(studentId?: string, subjectId?: string): Observable<any> {
    let url = `${this.apiUrl}/marks`;
    const params: string[] = [];
    if (studentId) params.push(`student=${studentId}`);
    if (subjectId) params.push(`subject=${subjectId}`);
    if (params.length > 0) url += '?' + params.join('&');
    return this.http.get<any>(url, this.getHeaders());
  }

  createMark(markData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/marks`, markData, this.getHeaders());
  }

  updateMark(id: string, markData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/marks/${id}`, markData, this.getHeaders());
  }

  deleteMark(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/marks/${id}`, this.getHeaders());
  }
}