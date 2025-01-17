import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ProjectService { 
private baseproject='https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { } 

  getprojects(category?:string):Observable<any>{ 
    let params=new HttpParams();
    if(category){ 
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseproject}/getproject`,{params})
  }

  postproject(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseproject}/postproject`, formData);
  }

  putproject(formData: FormData, projectId: string): Observable<any> {
    return this.http.put(`${this.baseproject}/updateproject/${projectId}`, formData);
  }

  deleteproject(projectId: string): Observable<any> {
    return this.http.delete(`${this.baseproject}/deleteproject/${projectId}`);
  }
}
 