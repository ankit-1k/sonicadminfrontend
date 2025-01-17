import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  logForm: FormGroup
  isLoading:boolean=false

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.logForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submitLogin() {
    this.isLoading=true
    if (this.logForm.valid) {
      this.loginService.loginUser(this.logForm.value).subscribe(
        (response: { token: string }) => {
          console.log('Login success...');
          this.isLoading=false
          setTimeout(() => {
            window.location.reload()
          }, 1);

          if (response.token) {
            this.router.navigate(['/home']);
          } else {
            Swal.fire({
              title: 'Failed!',
              text: 'server error...',
              icon: 'error'
            })
          }
        },
        (error: any) => { 
          this.isLoading=false
          console.log('Login failed...');
          Swal.fire({
            title: 'Failed!',
            text: 'login failed...',
            icon: 'error'
          })
        }
      );
    } else {
      Swal.fire({
        title: 'Invalid!',
        text: 'invalid fields...',
        icon: 'warning'
      })
    }
  }

  ngOnInit(): void {
  }

}
