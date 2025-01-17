import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from 'src/app/services/home.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admincontacts',
  templateUrl: './admincontacts.component.html',
  styleUrls: ['./admincontacts.component.scss']
})
export class AdmincontactsComponent implements OnInit {

  requestForm: FormGroup;
  visibleEdit: boolean = false;
  position: string = 'right';
  getAllContacts: any[] = [];
  selectedContact: any | null = null;

  constructor(private fb: FormBuilder, private homeService: HomeService) {
    this.requestForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  fetchContact() {
    this.homeService.getContact().subscribe({
      next: (response) => {
        this.getAllContacts = response;
      },
      error: () => {
        Swal.fire('Failed', 'Failed to fetch contacts.', 'error');
      },
    });
  }

  deleteContact(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.deleteContact(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The contact has been deleted.', 'success');
            this.fetchContact(); 
          },
          error: () => {
            Swal.fire('Failed!', 'Failed to delete the contact.', 'error');
          },
        });
      }
    });
  }

  // Method to set the selected contact data
  viewContact(contact: any) {
    this.selectedContact = contact;
  }

  ngOnInit(): void {
    this.fetchContact();
  }
}
