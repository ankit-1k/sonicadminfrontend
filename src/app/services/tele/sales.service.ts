import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private baseSales='https://sonicadminbackend.vercel.app/api'

  constructor(private http:HttpClient) { }

  getSales():Observable<any>{
    return this.http.get(`${this.baseSales}/getsales`)
  }

  postSales(user:any):Observable<any>{
    return this.http.post(`${this.baseSales}/postsales`,user)
  }

  putSales(data: any, salesId: any): Observable<any> {
    return this.http.put(`${this.baseSales}/updatesales/${salesId}`, data);
  }  
  
  deleteSales(salesId:any):Observable<any>{
    return this.http.delete(`${this.baseSales}/deletesales/${salesId}`)
  }

  searchUser(data: string): Observable<any> {
    return this.http.get(`${this.baseSales}/searchuser/${data}`);
  }  
} 
