import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseSales='https://sonicadminbackend.vercel.app/api'

  constructor(private http:HttpClient) { }

  postContact(data:any):Observable<any>{
    return this.http.post(`${this.baseSales}/postcontact`,data)
  }

  getContact():Observable<any>{
    return this.http.get(`${this.baseSales}/getcontact`)
  }  
  
  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.baseSales}/deletecontact/${id}`);
  }

  getNotifications(): Observable<any> {
    return this.http.get(`${this.baseSales}/getnotifications`);
  }

  // New DELETE clear notifications method
  clearNotifications(): Observable<any> {
    return this.http.delete(`${this.baseSales}/clearnotifications`);
  }
  
}
