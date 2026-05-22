import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define a structural interface matching our database records
export interface TaskItem {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Returns an Observable Array
  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.apiUrl}/tasks`);
  }

  // Sends the title inside a clean JSON Object body
  createTask(title: string): Observable<TaskItem> {
    return this.http.post<TaskItem>(`${this.apiUrl}/tasks`, { title });
  }

  // Sends the boolean state inside a clean JSON Object body
  updateTask(id: number, completed: boolean): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/tasks/${id}`, { completed });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }
}