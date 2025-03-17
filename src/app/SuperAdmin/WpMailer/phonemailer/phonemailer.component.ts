import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhonemailerService } from 'src/app/services/superadmin/mailer/phonemailer.service';

@Component({
  selector: 'app-phonemailer',
  templateUrl: './phonemailer.component.html',
  styleUrls: ['./phonemailer.component.scss']
})
export class PhonemailerComponent implements OnInit {
  displayDialog: boolean = false;
  phonemailerForm: FormGroup;
  phonemailerList: any[] = [];
  filteredList: any[] = []; // For filtering based on category
  selectedEntry: any = null;
  selectedCategory: string = 'All'; // Default selection
  categories = ['User 1', 'User 2']; // Available categories

  constructor(private fb: FormBuilder, private phonemailerService: PhonemailerService) {
    this.phonemailerForm = this.fb.group({
      CName: ['', Validators.required],
      CPhone: ['', [Validators.required]],
      Description: [''],
      Category: ['', Validators.required] // Added category field
    });
  }

  ngOnInit(): void {
    this.loadEntries();
  }

  openDialog(entry?: any) {
    this.displayDialog = true;
    if (entry) {
      this.selectedEntry = entry;
      this.phonemailerForm.patchValue(entry);
    } else {
      this.selectedEntry = null;
      this.phonemailerForm.reset();
    }
  }

  closeDialog() {
    this.displayDialog = false;
    this.selectedEntry = null;
    this.phonemailerForm.reset();
  }

  loadEntries() {
    this.phonemailerService.getEntries().subscribe(data => {
      this.phonemailerList = data;
      this.filterEntries(); // Apply filter when data is loaded
    });
  }

  filterEntries() {
    if (this.selectedCategory === 'All') {
      this.filteredList = this.phonemailerList;
    } else {
      this.filteredList = this.phonemailerList.filter(entry => entry.Category === this.selectedCategory);
    }
  }

  submitForm() {
    if (this.phonemailerForm.valid) {
      if (this.selectedEntry) {
        this.phonemailerService.updateEntry(this.selectedEntry._id, this.phonemailerForm.value).subscribe(() => {
          this.loadEntries();
          this.closeDialog();
        });
      } else {
        this.phonemailerService.addEntry(this.phonemailerForm.value).subscribe(() => {
          this.loadEntries();
          this.closeDialog();
        });
      }
    }
  }

  deleteEntry(id: string) {
    if (confirm("Are you sure you want to delete this entry?")) {
      this.phonemailerService.deleteEntry(id).subscribe(() => {
        this.loadEntries();
      });
    }
  }

  sendWhatsAppMessage(phone: string) {
    const whatsappUrl = `https://wa.me/${phone}`;
    window.open(whatsappUrl, '_blank');
  }

  makePhoneCall(phone: string) {
    window.location.href = `tel:${phone}`;
  }  
}
