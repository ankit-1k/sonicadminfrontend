import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { WebsiteService } from 'src/app/services/setting/website.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.scss']
})
export class WebsitesComponent implements OnInit {
  originForm: FormGroup;
  editForm: FormGroup;
  allWebsites: any[] = [];
  editMode: boolean = false;
  currentWebsite: any = null;

  constructor(private fb: FormBuilder, private websiteService: WebsiteService, private loginService: LoginService) {
    this.originForm = this.fb.group({
      sitename: ['', Validators.required],
      name: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      sitename: ['', Validators.required],

      access: [true]
    });
  }

  ngOnInit(): void {
    this.fetchWebsites();
  }

  submitOrigin() {
    if (this.originForm.valid) {
      Swal.fire({
        title: 'Verify',
        icon: 'warning',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
          maxlength: '20',
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirm'
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const password = result.value;
          this.loginService.loginUser({ password }).subscribe({
            next: () => {
              this.websiteService.postWebsite(this.originForm.value).subscribe({
                next: () => {
                  Swal.fire('Posted', 'Website published successfully...', 'success');
                  this.originForm.reset();
                  this.fetchWebsites();
                },
                error: () => {
                  Swal.fire('Error', 'Failed to publish...', 'error');
                }
              });
            },
            error: () => {
              Swal.fire('Authentication Failed', 'Invalid password', 'error');
            }
          });
        }
      });
    } else {
      Swal.fire('Invalid!', 'Invalid Field...', 'warning');
    }
  }

  fetchWebsites() {
    this.websiteService.getWebsite().subscribe({
      next: response => {
        this.allWebsites = response;
      },
      error: () => {
        Swal.fire('Error', 'Failed to fetch websites...', 'error');
      }
    });
  }

  editWebsite(website: any) {
    this.editMode = true;
    this.currentWebsite = website;
    this.editForm.patchValue({
      name: website.name,
      sitename: website.sitename,
      access: website.access
    });
  }

  updateWebsite() {
    if (this.editForm.valid) {
      Swal.fire({
        title: 'Verify',
        icon: 'warning',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
          maxlength: '20',
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirm'
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const password = result.value;
          this.loginService.loginUser({ password }).subscribe({
            next: () => {
              const updatedData = this.editForm.value;
              const id = this.currentWebsite._id;

              this.websiteService.updateWebsite({ id, updatedData }).subscribe({
                next: () => {
                  Swal.fire('Updated', 'Website updated successfully...', 'success');
                  this.editMode = false;
                  this.currentWebsite = null;
                  this.fetchWebsites();
                },
                error: () => {
                  Swal.fire('Error', 'Failed to update website...', 'error');
                }
              });
            },
            error: () => {
              Swal.fire('Authentication Failed', 'Invalid password', 'error');
            }
          });
        }
      });
    } else {
      Swal.fire('Invalid!', 'Invalid Field...', 'warning');
    }
  }

  deleteWebsite(website: any) {
    Swal.fire({
      title: 'Varify',
      icon: 'warning',
      input: `password`,
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        maxlength: '20',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const password = result.value
        this.loginService.loginUser({ password }).subscribe({
          next: () => {
            this.confirmDelete(website);
          },
          error: () => {
            Swal.fire('Authentication Failed', 'Invalid password', 'error');
          }
        })
      }
    });
  }

  private confirmDelete(website: any) {
    this.websiteService.deleteWebsite(website._id).subscribe({
      next: () => {
        Swal.fire('Deleted!', 'The website has been deleted.', 'success');
        this.fetchWebsites();
      },
      error: () => {
        Swal.fire('Error!', 'There was an issue deleting the website.', 'error');
      }
    })
  }

  cancelEdit() {
    this.editMode = false;
    this.currentWebsite = null;
  }
}
