import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HomeService } from 'src/app/services/home.service';
import { HeaderService } from 'src/app/services/sidebar/header.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private otpService: HeaderService, private messageService: MessageService,private homeService: HomeService) { }

  isFullScreen = false;
  sidebarVisible2: boolean = true;
  isLoggedIn: boolean = false;
  email: string = 'pandaankit167@gmail.com';
  otpSent: boolean = false;
  otp: string = ''; 
  otpMessage: string = '';
  otpError: string = '';
  otpVerificationMessage: string = '';
  otpVerificationError: string = '';
  otpVerified: boolean = false;
  visibleOtpModal: boolean = false;
  isTokenPresent: boolean = false;
  isLoading: boolean = false
  notifications: any[] = [];

  ngOnInit(): void {
    this.listenToFullscreenChanges();
    this.checkLoginStatus();
    this.checkTokenPresence();
    this.fetchNotifications()
  }

  toggleFullScreen(): void {
    const element = document.documentElement;
    if (!this.isFullScreen) {
      // Enter fullscreen mode
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }
 
  private listenToFullscreenChanges(): void {
    // Update fullscreen status when the fullscreen state changes
    document.addEventListener('fullscreenchange', () => {
      this.isFullScreen = !!document.fullscreenElement;
    });
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = token ? true : false;
  }

  private checkTokenPresence(): void {
    const optToken = localStorage.getItem('optToken');
    this.isTokenPresent = optToken ? true : false;
  }

  sendOtp(): void {
    this.isLoading = true;
    this.otpService.sendOtp(this.email).subscribe(
      (response) => {
        this.isLoading = false
        this.otpSent = true;
        this.otpMessage = response.message;
        this.otpError = '';
        this.visibleOtpModal = false;
        Swal.fire({
          title: 'Success!',
          text: 'OTP has been sent successfully.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
        }).then((result) => {
          this.visibleOtpModal = true;
        });
      },
      (error) => {
        this.isLoading = false
        this.otpError = error.error.message || 'Error sending OTP.';
        this.otpMessage = '';
      }
    );
  }

  verifyOtp(): void {
    this.isLoading = true
    this.otpService.verifyOtp(this.email, this.otp).subscribe(
      response => {
        this.isLoading = false
        this.otpVerificationMessage = response.message;
        this.otpVerificationError = '';

        localStorage.setItem('optToken', response.token);
        localStorage.setItem('otpVerified', 'true');
        this.otpVerified = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.otpVerificationMessage,
        });
        this.router.navigate(['/telsales'])
        this.visibleOtpModal = false
        setTimeout(() => {
          window.location.reload();
        }, 1);
      },
      error => {
        this.isLoading = false
        this.otpVerificationMessage = '';
        this.otpVerificationError = error.error.message;
        this.visibleOtpModal = false

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.otpVerificationError,
        });
      }
    );
  }

  showDialogOtpModal() {
    this.visibleOtpModal = true;
    this.sidebarVisible2 = false
  }

  logoutSuperAdmin() {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'You will logout from super admin...',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('optToken');
        localStorage.removeItem('otpVerified');
        this.router.navigate(['/home'])
        setTimeout(() => {
          window.location.reload();
        }, 500);

        Swal.fire('Cleared!', 'Your session has been cleared.', 'success');
      } else {
        Swal.fire('Cancelled', 'Your session is safe.', 'info');
      }
    })
  }

  logout(): void {
    this.sidebarVisible2 = false
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.logoutSuperAdmin()
    this.router.navigate(['/login'])
  }

  fetchNotifications() {
      this.homeService.getNotifications().subscribe({
        next: (notifications) => {
          this.notifications = notifications;
        },
        error: () => {
          Swal.fire('Failed', 'Failed to fetch notifications.', 'error');
        },
      });
    }
  
    clearNotifications() {
      this.homeService.clearNotifications().subscribe({
        next: () => {
          this.notifications = [];
        },
        error: () => {
          Swal.fire('Failed', 'Failed to clear notifications.', 'error');
        },
      });
    }
}
