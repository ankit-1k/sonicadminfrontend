import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://sonicadminbackend.vercel.app/api';

@Injectable({
  providedIn: 'root'
})
export class PhonemailerService {
  constructor(private http: HttpClient) {}

  getEntries(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/phonemailerget`);
  }

  addEntry(data: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/phonemailerpost`, data);
  }

  updateEntry(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/phonemaileredit/${id}`, data);
  }

  deleteEntry(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/phonemailerdelete/${id}`);
  }
}
