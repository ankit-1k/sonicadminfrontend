import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService { 

  private baseUrl='https://sonicadminbackend.vercel.app/api'

  constructor(private http:HttpClient) { }

  postReq(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/reqpost`,data) 
  }

  getReq():Observable<any>{
    return this.http.get(`${this.baseUrl}/reqget`)
  }

  deleteReq(reqId:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}/deletereq/${reqId}`)
  }
}
