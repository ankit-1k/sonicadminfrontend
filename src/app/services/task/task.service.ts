import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl='https://sonicadminbackend.vercel.app/api'

  constructor(private http:HttpClient) { }

  postTask(data:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/taskpost`,data)
  }

  getTask():Observable<any>{
    return this.http.get(`${this.baseUrl}/taskget`)
  }

  deleteTask(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}/taskdelete/${id}`)
  }
}
