import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectdataService {
  private baseUrl='http://localhost:4300/api'

  constructor(private http:HttpClient) { }

  public postCollectData(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/postcollectdata`,data)
  }

  public getCollectData():Observable<any>{
    return this.http.get(`${this.baseUrl}/getcollectdata`)
  }

  public updateCollectData(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updatecollectdata/${id}`, data);
  }
  
  public deleteCollectData(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletecollectdata/${id}`);
  }

  public sendEmail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-email-c`, data);
  }
 
  sendMails(data: any) {
    return this.http.post(`${this.baseUrl}/send-mails`, data);
  }  

  deleteAllRecords(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-all`);
}

}
