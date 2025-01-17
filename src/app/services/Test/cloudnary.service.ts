import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudnaryService {

  private uploadUrl = 'https://sonicadminbackend.vercel.app/api';  // Your backend API endpoint

  constructor(private http: HttpClient) { } 

  uploadImage(formData: any): Observable<any> {
    return this.http.post<any>(`${this.uploadUrl}/upload-image`, formData);
  }

  getImg():Observable<any>{
    return this.http.get(`${this.uploadUrl}/getimg`)
  }

  deleteImage(id: string): Observable<any> {
    return this.http.delete(`${this.uploadUrl}/delete-image/${id}`);
  }  
}
