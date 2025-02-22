import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectdataService } from 'src/app/services/superadmin/collectdata/collectdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collectdata',
  templateUrl: './collectdata.component.html',
  styleUrls: ['./collectdata.component.scss']
})
export class CollectdataComponent implements OnInit {
  formData: FormGroup
  emailForm: FormGroup;
  allCollectData: any[] = []
  editMode: boolean = false;
  selectedData: any = null;
  visible: boolean = false;
  position: string = 'center';
  recipientEmail: string = '';
  isLoading:boolean=false

  constructor(private fb: FormBuilder, private colllectDataService: CollectdataService) {
    this.formData = this.fb.group({
      orgName: ['', Validators.required],
      orgType: ['', Validators.required],
      email: [''],
      phone: [''],
      country: [''],
      details: ['', Validators.required]
    })
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  orgType: any = [
    { name: 'Restruant', label: 'Restruant' },
    { name: 'Youtube', label: 'Youtube' },
    { name: 'School', label: 'School' }
  ]

  countryName: any = [
    { name: 'India', label: 'India' },
    { name: 'USA', label: 'USA' }
  ]

  ngOnInit(): void {
    this.fetchAllData()
  }

  addOrUpdateData() {
    if (this.formData.valid) {
      this.isLoading=true
      if (this.editMode) {
        // Update existing data
        this.colllectDataService.updateCollectData(this.selectedData._id, this.formData.value).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated',
              text: 'Data updated successfully...',
              icon: 'success',
              timer: 1000
            });
            this.editMode = false;
            this.selectedData = null;
            this.formData.reset();
            this.fetchAllData();
            this.isLoading=false
          },
          error: () => {
            Swal.fire('Failed', 'Failed to update data...', 'error');
            this.isLoading=false
          }
        });
      } else {
        // Add new data
        this.colllectDataService.postCollectData(this.formData.value).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success',
              text: 'Data posted successfully...',
              icon: 'success',
              timer: 1000
            });
            this.formData.reset();
            this.fetchAllData();
            this.isLoading=false
          },
          error: error => {
            Swal.fire('Failed', 'Failed to upload data...', 'error');
            this.isLoading=false
          }
        });
      }
    } else {
      Swal.fire('Invalid', 'Please fill in required fields...', 'warning');
    }
  }

  editData(data: any) {
    this.editMode = true;
    this.selectedData = data;
    this.formData.patchValue(data);
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedData = null;
    this.formData.reset();
  }
  fetchAllData() {
    this.isLoading=true
    this.colllectDataService.getCollectData().subscribe({
      next: response => {
        this.allCollectData = response.data
        console.log(this.allCollectData)
        this.isLoading=false
      },
      error: error => {
        console.log(error)
        this.isLoading=false
      }
    })
  }

  deleteData(id: string) {
    this.isLoading=true
    this.colllectDataService.deleteCollectData(id).subscribe({
      next: response => {
        Swal.fire({
          title: 'Deleted',
          text: 'Data Deleted successfully...',
          icon: 'success',
          timer: 1000
        });
        this.fetchAllData();
        this.isLoading=false
      },
      error: error => {
        Swal.fire('Failed', 'Failed to delete data', 'error');
        this.isLoading=false
      }
    });
  }

  deleteAllData() {
    let countdown = 5; // 5-second countdown
    let timerInterval: any;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete all records!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7349BD',
      confirmButtonText: `Yes, delete all! (${countdown})`, // Initial countdown in button
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.disabled = true; // Disable the button initially
        }
  
        timerInterval = setInterval(() => {
          countdown--;
  
          if (confirmButton) {
            confirmButton.innerText = `Yes, delete all! (${countdown})`; // Update button text
          }
  
          if (countdown <= 0) {
            clearInterval(timerInterval);
            if (confirmButton) {
              confirmButton.disabled = false; // Enable button after countdown
              confirmButton.innerText = 'Yes, delete all!'; // Reset button text
            }
          }
        }, 1000);
      }
    }).then((result) => {
      this.isLoading=true
      if (result.isConfirmed) {
        this.colllectDataService.deleteAllRecords().subscribe(
          () => {
            Swal.fire('Deleted!', 'All records have been deleted.', 'success');
            this.fetchAllData();
            this.isLoading=false
          },
          (error) => {
            console.error('Error deleting all data:', error);
            Swal.fire('Error!', 'Something went wrong.', 'error');
            this.isLoading=false
          }
        );
      }
    });
  } 

  sendMailDialog(email: string, position: string) {
    this.recipientEmail = email;
    this.position = position;
    this.visible = true;
  }

  sendMail() {
    if (this.emailForm.valid) {
      this.isLoading=true
      const emailData = {
        to: this.recipientEmail,
        subject: this.emailForm.value.subject,
        message: this.emailForm.value.message
      };

      this.colllectDataService.sendEmail(emailData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success',
            text: 'Email sent successfully!',
            icon: 'success',
            timer: 1000
          });
          this.isLoading=false
          this.visible = false;
          this.emailForm.reset();
        },
        error: () => {
          Swal.fire('Failed', 'Failed to send email.', 'error');
          this.isLoading=false
        }
      });
    } else {
      Swal.fire('Warning', 'Please fill in all fields.', 'warning');
    }
  }
}
