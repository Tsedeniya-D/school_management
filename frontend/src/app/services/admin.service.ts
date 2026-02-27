import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Users
  getUsers(role?: string): Observable<any> {
    const url = role ? `${this.apiUrl}/users?role=${role}` : `${this.apiUrl}/users`;
    return this.http.get<any>(url);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  // Subjects
  getSubjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/subjects`);
  }

  createSubject(subjectData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subjects`, subjectData);
  }

  updateSubject(id: string, subjectData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/subjects/${id}`, subjectData);
  }

  deleteSubject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/subjects/${id}`);
  }

  // Grades
  getGrades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grades`);
  }

  createGrade(gradeData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grades`, gradeData);
  }

  updateGrade(id: string, gradeData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/grades/${id}`, gradeData);
  }

  deleteGrade(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/grades/${id}`);
  }

  assignToGrade(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grades/${id}/assign`, data);
  }

  // Statistics
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
