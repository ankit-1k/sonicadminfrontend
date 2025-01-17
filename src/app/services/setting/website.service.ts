import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private baseUrl='https://sonicadminbackend.vercel.app/api'

  constructor(private http:HttpClient) { }

  postWebsite(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/webpost`,data) 
  }

  getWebsite():Observable<any>{
    return this.http.get(`${this.baseUrl}/webget`) 
  }

  updateWebsite(data: any) {
    return this.http.put(`${this.baseUrl}/webupdate`, data);
  } 

  deleteWebsite(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}/webdelete/${id}`)
  }
}
 