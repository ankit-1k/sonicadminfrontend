import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseNews='https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { }

  getNews(category?:string):Observable<any>{
    let params=new HttpParams();
    if(category){
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseNews}/getnews`,{params})
  }

  postNews(newsData: any): Observable<any> {
    return this.http.post(`${this.baseNews}/postnews`, newsData);
  }

  putNews(newsData: any): Observable<any> {
    return this.http.put(`${this.baseNews}/updatenews/${newsData._id}`, newsData);
  }

  deleteNews(newsId: string): Observable<any> {
    return this.http.delete(`${this.baseNews}/deletenews/${newsId}`);
  }
}
 