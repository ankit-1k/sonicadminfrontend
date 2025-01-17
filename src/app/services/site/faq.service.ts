import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private baseFaq='https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { } 

  getFaqs(category?:string):Observable<any>{
    let params=new HttpParams();
    if(category){
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseFaq}/getfaq`,{params})
  }

  postFaq(faqData: any): Observable<any> {
    return this.http.post(`${this.baseFaq}/postfaq`, faqData);
  }

  putFaq(faqData: any): Observable<any> {
    return this.http.put(`${this.baseFaq}/updatefaq/${faqData._id}`, faqData);
  }

  deleteFaq(faqId: string): Observable<any> {
    return this.http.delete(`${this.baseFaq}/deletefaq/${faqId}`);
  }
}
 