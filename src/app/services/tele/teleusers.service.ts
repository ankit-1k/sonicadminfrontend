import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeleusersService {
  private baseSales = 'https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { }

  getSales(): Observable<any> {
    return this.http.get(`${this.baseSales}/getsales`)
  }
}
