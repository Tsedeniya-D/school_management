import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:3000/api/teacher';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students`);
  }

  getStudent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/students/${id}`);
  }

  getMarks(studentId?: string, subjectId?: string): Observable<any> {
    let url = `${this.apiUrl}/marks`;
    const params: string[] = [];
    if (studentId) params.push(`student=${studentId}`);
    if (subjectId) params.push(`subject=${subjectId}`);
    if (params.length > 0) url += '?' + params.join('&');
    return this.http.get<any>(url);
  }

  createMark(markData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/marks`, markData);
  }

  updateMark(id: string, markData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/marks/${id}`, markData);
  }

  deleteMark(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/marks/${id}`);
  }
}
