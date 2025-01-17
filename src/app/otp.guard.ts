import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OtpGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const optToken = localStorage.getItem('optToken'); // Check for 'optToken'
    const otpVerified = localStorage.getItem('otpVerified'); // OTP verification status

    if (optToken && otpVerified === 'true') {
      // The user is authenticated and OTP is verified
      return true;
    } else {
      // Either the token is missing or OTP is not verified, redirect to OTP verification page
      this.router.navigate(['/otp-verify']);
      return false;
    }
  }
}
