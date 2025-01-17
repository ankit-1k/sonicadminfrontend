import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string; 
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginApi = 'https://sonicadminbackend.vercel.app/api/login'; 

  constructor(private http: HttpClient) { }

  loginUser(data: any): Observable<LoginResponse> { 
    return this.http.post<LoginResponse>(this.loginApi, data).pipe(
      tap(response => {
        // Ensure the token is present
        if (response.token) {
          localStorage.setItem('token', response.token);
        } else {
          // Handle the case where token is not returned
          console.error('No token received from backend');
        }
      })
    );
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false; // No token means not authenticated

    // Decode token and check expiration
    try {
      const decoded: any = jwtDecode(token); // Use jwtDecode function
      const expirationDate = decoded.exp * 1000; // Convert exp to milliseconds
      return expirationDate > Date.now(); // Check if the token is still valid
    } catch (error) {
      return false; // If there's an error in decoding, return false
    }
  }

  logout() {
    // Remove token on logout
    localStorage.removeItem('token');
  }
}
