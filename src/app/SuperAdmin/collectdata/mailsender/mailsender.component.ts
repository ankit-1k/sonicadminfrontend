import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CollectdataService } from 'src/app/services/superadmin/collectdata/collectdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mailsender',
  templateUrl: './mailsender.component.html',
  styleUrls: ['./mailsender.component.scss']
})
export class MailsenderComponent implements OnInit {

  mailForm: FormGroup;
  allData: any[] = [];
  orgType: any[] = [];
  filteredEmails: string[] = []; // Store filtered emails based on selection
  visibleMails: boolean = false;
  position: string = 'center';
  isLoading:boolean=false
  showDialogMails(position: string) {
    this.position = position;
    this.visibleMails = true;
  }

  constructor(private fb: FormBuilder, private collectdataService: CollectdataService) {
    this.mailForm = this.fb.group({
      selectedOrgType: [null],
      subject: [''],
      message: ['']
    });
  }

  ngOnInit(): void {
    this.fetchAllCollectedData();
    this.onOrgTypeChange(); // Call function to listen for dropdown changes
  }

  fetchAllCollectedData() {
    this.isLoading=true
    this.collectdataService.getCollectData().subscribe({
      next: response => {
        this.allData = response.data;
        console.log(this.allData);
        this.populateOrgTypes();
        this.isLoading=false
      },
      error: () => {
        this.isLoading=false
        Swal.fire({
          title: 'Failed',
          text: 'Failed to fetch Data (mailsender)',
          icon: 'error',
          timer: 1000
        });
      }
    });
  }

  populateOrgTypes() {
    const uniqueOrgTypes = [...new Set(this.allData.map(item => item.orgType))];
    this.orgType = uniqueOrgTypes.map(type => ({ name: type, label: type }));
  }

  onOrgTypeChange() {
    this.mailForm.get('selectedOrgType')?.valueChanges.subscribe(selectedType => {
      if (selectedType) {
        this.filteredEmails = this.allData
          .filter(item => item.orgType === selectedType)
          .map(item => item.email); // Extract only emails
      } else {
        this.filteredEmails = []; // Reset if no selection
      }
    });
  }

  sendMail() {
    this.isLoading=true
    if (!this.mailForm.valid) {
      Swal.fire('Error', 'Please fill all fields before sending mail', 'error');
      return;
    }

    const formData = {
      selectedOrgType: this.mailForm.value.selectedOrgType,
      subject: this.mailForm.value.subject,
      message: this.mailForm.value.message
    };

    this.collectdataService.sendMails(formData).subscribe({
      next: response => {
        this.isLoading=false
        Swal.fire('Success', 'Emails sent successfully', 'success');
        this.mailForm.reset(); // Reset the form after sending mail
      },
      error: () => {
        this.isLoading=false
        Swal.fire('Error', 'Failed to send emails', 'error');
      }
    });
  }

}
