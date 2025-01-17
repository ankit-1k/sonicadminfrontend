import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
private baseAbout='https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { }

  getAbouts(category?:string):Observable<any>{
    let params=new HttpParams();
    if(category){
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseAbout}/getabout`,{params})
  }

  postAbout(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseAbout}/postabout`, formData);
  }

  putAbout(formData: FormData,aboutId:any): Observable<any> {
    return this.http.put(`${this.baseAbout}/updateabout/${aboutId}`, formData);
  }

  deleteAbout(aboutId: string): Observable<any> {
    return this.http.delete(`${this.baseAbout}/deleteabout/${aboutId}`);
  }
}
 