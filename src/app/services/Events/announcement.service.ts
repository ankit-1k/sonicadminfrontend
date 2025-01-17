import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private baseAnnouncement='https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { }

  getAnnouncements(category?:string):Observable<any>{
    let params=new HttpParams();
    if(category){
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseAnnouncement}/getannouncement`,{params})
  }

  postAnnouncement(announcementData: any): Observable<any> {
    return this.http.post(`${this.baseAnnouncement}/postannouncement`, announcementData);
  }

  putAnnouncement(announcementData: any): Observable<any> {
    return this.http.put(`${this.baseAnnouncement}/updateannouncement/${announcementData._id}`, announcementData);
  }

  deleteAnnouncement(announcementId: string): Observable<any> {
    return this.http.delete(`${this.baseAnnouncement}/deleteannouncement/${announcementId}`);
  }
}
 