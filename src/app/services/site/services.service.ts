import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private baseService='https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { }

  getServices(category?:string):Observable<any>{
    let params=new HttpParams();
    if(category){
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseService}/getservice`,{params})
  }

  postService(serviceData: any): Observable<any> {
    return this.http.post(`${this.baseService}/postservice`, serviceData);
  }

  putService(serviceData: any): Observable<any> {
    return this.http.put(`${this.baseService}/updateservice/${serviceData._id}`, serviceData);
  }

  deleteService(serviceId: string): Observable<any> {
    return this.http.delete(`${this.baseService}/deleteservice/${serviceId}`);
  }
}
 