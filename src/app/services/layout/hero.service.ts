import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private baseHero='https://sonicadminbackend.vercel.app/api' 
 
  constructor(private http: HttpClient) { }

  getHeros(category?:string):Observable<any>{
    let params=new HttpParams();
    if(category){
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseHero}/gethero`,{params})
  }

  postHero(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseHero}/posthero`, formData);
  }

  putHero(formData: FormData, projectId: string): Observable<any> {
    return this.http.put(`${this.baseHero}/updatehero/${projectId}`, formData);
  }

  deleteHero(heroId: string): Observable<any> {
    return this.http.delete(`${this.baseHero}/deletehero/${heroId}`);
  }
}
