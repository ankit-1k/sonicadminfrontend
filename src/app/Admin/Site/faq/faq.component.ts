import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from 'src/app/services/setting/website.service';
import { FaqService } from 'src/app/services/site/faq.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  position: string = 'center';
  faqs: Faq[] = [];
  filteredfaqs: Faq[] = [];
  categories: any[] = [
    { label: 'Science', value: 'Science' },
    { label: 'Science & Technology', value: 'Science & Technology' },
    { label: 'Science and Technology', value: 'Science and Technology' }
  ];
  selectedCategory: string = '';
  faqFrom: FormGroup
  selectedfaq: Faq | null = null;
  selectedfaqForView: Faq | null = null;
  isLoading: boolean = false

  constructor(private fb: FormBuilder, private faqService: FaqService, private siteService: WebsiteService) {
    this.faqFrom = this.fb.group({
      question: ['', Validators.required],
      category: ['', Validators.required],
      desc: ['', Validators.required],
    })
  }

  fetchSites() {
    this.isLoading = true
    this.siteService.getWebsite().subscribe({
      next: (response: any[]) => {
        this.categories = response.map(site => ({
          label: site.name,
          value: site.name
        }))
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
        Swal.fire('Failed', 'failed to fetch sites...', 'error')
      }
    })
  }
  fetchfaqs(category?: string): void {
    this.isLoading = true
    this.faqService.getFaqs(category).subscribe({
      next: response => {
        this.faqs = response;
        this.filterfaqsByCategory();
        this.isLoading = false
      },
      error: error => {
        console.log('Error fetching faqs...');
        this.isLoading = false
      }
    });
  }

  filterfaqsByCategory(): void {
    if (this.selectedCategory) {
      this.filteredfaqs = this.faqs.filter(faq => faq.category === this.selectedCategory);
    } else {
      this.filteredfaqs = this.faqs;
    }
  }

  onCategoryChange() {
    this.filterfaqsByCategory();
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.visibleAdd = true;
  }

  submitfaq() {
    if (this.faqFrom.valid) {
      this.visibleAdd = false
      this.visibleEdit = false
      this.isLoading = true
      const faqData = this.faqFrom.value;

      if (this.selectedfaq) {
        this.isLoading = true
        // Edit existing faq
        this.faqService.putFaq({ ...faqData, _id: this.selectedfaq._id }).subscribe({
          next: response => {
            console.log('faq updated:', response);
            this.fetchfaqs();
            this.visibleEdit = false;
            this.faqFrom.reset();
            this.selectedfaq = null;
            this.isLoading = false
          },
          error: error => {
            console.log('Error updating faq:', error);
            this.isLoading = false
          }
        });
      } else {
        // Add new faq
        this.isLoading = true
        this.faqService.postFaq(faqData).subscribe({
          next: response => {
            console.log('faq added:', response);
            this.fetchfaqs();
            this.visibleAdd = false;
            this.faqFrom.reset();
            this.isLoading = false
          },
          error: error => {
            console.log('Error adding faq:', error);
            this.isLoading = false
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  showDialogEdit(position: string, faq: Faq) {
    this.position = position;
    this.visibleEdit = true;
    this.selectedfaq = faq;
    if (faq) {
      this.faqFrom.patchValue(faq);
    }
  }

  deletefaq(faq: Faq): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the faq: ${faq.question}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading=true
        this.faqService.deleteFaq(faq._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The faq has been deleted.', 'success');
            this.fetchfaqs();
            this.isLoading=false
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the faq.', 'error');
            console.log('Error deleting faq:', error);
            this.isLoading=false
          }
        });
      }
    });
  }

  viewData(faq: any) {
    this.selectedfaqForView = faq;
  }

  ngOnInit(): void {
    this.fetchfaqs();
    this.fetchSites()
  }
}
export interface Faq {
  _id: string;
  question: string;
  desc: string;
  category: string;
  date: string;
}